import * as Steem from '../../../node_modules/steem/lib';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  constructor() {
    Steem.api.setOptions({ url: 'https://api.steemit.com' });
  }



  getPosts(quantity: number, lastPermLink: string, lastAuthor: string): any {
    console.log(Steem);
    const query = {
      tag: "shareitv0.1",
      //app: 'steemit/0.2',
      limit: quantity,
      start_author: lastAuthor,
      permlink: lastPermLink
    };
    return Steem.api.getDiscussionsByCreatedAsync(query).then(res => {
      console.log(res);
      return res;
    });
  }
}