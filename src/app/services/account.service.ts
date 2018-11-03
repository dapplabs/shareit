import * as Steem from '../../../node_modules/steem/lib';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor() {
    Steem.api.setOptions({url: 'https://api.steemit.com'});
    console.log({url: 'https://api.steemit.com'});
  }

  getAccount(id: number): any {
    Steem.api.getAccountReferences(id, function(err, result) {
      return result;
    });
  }
}