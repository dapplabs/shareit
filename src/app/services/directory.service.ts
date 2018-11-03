import * as Steem from '../../../node_modules/steem/lib';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  constructor() {
    Steem.api.setOptions({url: 'https://api.steemit.com'});
    console.log({url: 'https://api.steemit.com'});
  }

  getPosts(): any {
    console.log("holi");
    /*
    var query = {
      tag: 'introduceyourself',
      limit: 10,
      start_author: 'lada94',
      start_permlink: 'introduce-youself-steemit'
    };
    */
   var query = {
      json_metadata: {
        tags: ["steemit"]
      }
    };
    return Steem.api.getDiscussionsByCreatedAsync(query).then((res, err) => {
      console.log(err);
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