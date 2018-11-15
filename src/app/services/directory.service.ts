import * as Steem from '../../../node_modules/steem/lib';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  constructor() {
    Steem.api.setOptions({url: 'https://api.steemit.com'});
  }

  getPosts(quantity: number, lastPermLink: string, lastAuthor: string): any {
    console.log(Steem);
    const query = {
      limit: quantity,
      start_author: lastAuthor,
      permlink: lastPermLink
    };
    return Steem.api.getDiscussionsByCreatedAsync(query).then(res => {
      console.log(res);
      res.forEach(element => {
        element.body = "Where...am I...? Before he knows it, Kirito has made a full-dive into an epic, fantasy-like virtual world. With only a murky recollection of what happened right before he logged in, he starts to wander around, searching for clues. He comes upon an enormous, pitch dark tree (the Gigas Cedar), where he encounters a boy. My name is Eugeo. Nice to meet you, Kirito. Although he is supposedly a resident of the virtual world – an NPC – the boy shows the same array of emotions as any human being. As Kirito bonds with Eugeo, he continues to search for a way to log out of this world. Meanwhile, he remembers a certain memory deep down within him. He remembers racing through the mountains with Eugeo as a child... A memory that he should not have in the first place. And in this memory, he sees someone other than Eugeo, a young blond girl. Her name is Alice. And it is a name that must never be forgotten...";
        element.title = "Sword Art Online - Alicization 2018"
      });
      return res;
    });
  }

/**
 * Casts a vote.
 * @param {String} username - username of the voter account
 * @param {String} postingkey - posting key of the voter account
 * @param {String} author - Author of the post
 * @param {String} permlink - permanent link of the post to comment to. eg : https://steemit.com/programming/@howo/introducting-steemsnippets the permlink is "introducting-steemsnippets"
 * @param {int} weight - Power of the vote, can range from -10000 to 10000, 10000 equals a 100% upvote. -10000 equals a 100% flag.
 */
  vote(username, postingkey, author, permlink, weight)
  {
      Steem.broadcast.vote(postingkey, username, author, permlink, weight, function(err, result) {
          console.log(err, result);
      });
  }

  /**
 * Posts a comment on an already existing article
 * @param {String} username - username of the account
 * @param {String} password - password of the account
 * @param {String} author - Author of the post to comment to
 * @param {String} permlink - permanent link of the post to comment to. eg : https://steemit.com/programming/@howo/introducting-steemsnippets the permlink is "introducting-steemsnippets"
 * @param {String} text - Content of the comment.
 * @param {object} [jsonMetadata] - dictionnary with additional tags, app name, etc,
 */
 comment(username, password, author,  permlink, text, jsonMetadata) {
  var wif = Steem.auth.toWif(username, password, 'posting');
  jsonMetadata = jsonMetadata || {};
  var comment_permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();

  Steem.broadcast.comment(wif, author, permlink, username, comment_permlink , '', text, jsonMetadata, function(err, result) {
      console.log(err, result);
  });
}
}