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
  /*public Post(username: string, postingkey: string, main_tag: string, title: string, body: string, jsonMetadata: any) {
    // By default permlink will be the date
    var comment_permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();

    jsonMetadata = jsonMetadata || {};

    jsonMetadata['tags'].unshift("shareitv0.2");
    jsonMetadata.app = "shareit/0.2";

    console.log(jsonMetadata);
    body = "{{ https://marce1994.github.io/MyPWA/#/Play/"+username+"/" + comment_permlink + " }}" + body;
    Steem.broadcast.comment(postingkey, '', main_tag, username, comment_permlink, title, body, jsonMetadata, function (err, result) {
      console.log(err, result);
    });
  }*/

  public Post(username: string, postingkey: string, main_tag: string, title: string, body: string, jsonMetadata: any) {
    var permLink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
    
    if (permLink.length > 255) {
      // pay respect to STEEMIT_MAX_PERMLINK_LENGTH
      permLink.substr(permLink.length - 255, permLink.length);
    }
    // permlinks must be lower case and not contain anything but
    // alphanumeric characters plus dashes
    permLink = permLink.toLowerCase().replace(/[^a-z0-9-]+/g, "");

    jsonMetadata['tags'].unshift("shareitv0.2");
    jsonMetadata.app = "shareit/0.2";
    jsonMetadata = jsonMetadata || {};

    body = "{{ https://marce1994.github.io/MyPWA/#/Play/"+username+"/" + permLink + " }}" + body;
    
    Steem.broadcast.comment(postingkey, '',  main_tag, username, permLink, title, body, jsonMetadata, function (err, result) {
        console.log(err, result);
    });
}
  // example
  //post("username", "password", "tag1", "title", "body", { tags: ['tag2', 'tag3']});
}
