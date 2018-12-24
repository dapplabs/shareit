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
    console.log(lastPermLink);
    console.log(lastAuthor);
    const query = {
      tag: "shareitv0s2",
      limit: Math.round(quantity),
      start_author: lastAuthor != ""? lastAuthor:null,
      start_permlink: lastPermLink != ""? lastPermLink:null,
    };

    /*
    {
    "tag": "",
    "limit": 0,
    "filter_tags": [],
    "select_authors": [],
    "select_tags": [],
    "truncate_body": 0
  }
    
    */

    console.log(query);
    return Steem.api.getDiscussionsByCreatedAsync(query).then(res => {
      return res;
    }).catch((err)=> {
      console.log("Ocurrió un error al obtener las cards de directory", err);
    });
  }
}