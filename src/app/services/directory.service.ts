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
    console.log(Steem);
    const query = {
      limit: 10
    };
    return Steem.api.getDiscussionsByCreatedAsync(query).then(res => res);
  }
}
