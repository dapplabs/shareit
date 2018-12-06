import * as Steem from '../../../node_modules/steem/lib';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor() {
    Steem.api.setOptions({ url: 'https://api.steemit.com' });
  }

  /**
   * Casts a vote.
   * @param {String} username - username of the voter account
   * @param {String} postingkey - posting key of the voter account
   * @param {String} author - Author of the post
   * @param {String} permlink - permanent link of the post to comment to. eg : https://steemit.com/programming/@howo/introducting-steemsnippets the permlink is "introducting-steemsnippets"
   * @param {int} weight - Power of the vote, can range from -10000 to 10000, 10000 equals a 100% upvote. -10000 equals a 100% flag.
   */
  public Vote(username: string, postingkey: string, author: string, permlink: string, weight: number) {
    Steem.broadcast.vote(postingkey, username, author, permlink, weight, function (err, result) {
      console.log(err, result);
    });
  }

  /**
 * Posts an article to the steem blockchain
 * @param {String} username - username of the account
 * @param {String} postingkey - private posting key of the account
 * @param {String} main_tag - The main tag for the post
 * @param {String} title - Title of the post
 * @param {String} body - body (content) of the post.
 * @param {object} [jsonMetadata] - dictionnary with additional tags, app name, etc,
 * @param {String} [permlink] - permanent link, by default it's the date + -post. eg : 20171237t122520625z-post
 */
  public Post(username: string, postingkey: string, main_tag: string, title: string, body: string, jsonMetadata: any, permlink: string) {
    // By default permlink will be the date
    permlink = permlink || new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
    jsonMetadata = jsonMetadata || {};
    jsonMetadata['tags'].push("shareit-test");
    jsonMetadata['tags'].push("anime");
    console.log(jsonMetadata);

    Steem.broadcast.comment(postingkey, '', main_tag, username, permlink + '-post', title, body, jsonMetadata, function (err, result) {
      console.log(err, result);
    });
  }
  // example
  //post("username", "password", "tag1", "title", "body", { tags: ['tag2', 'tag3']});
}
