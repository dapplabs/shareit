import * as Steem from '../../../node_modules/steem/lib';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor() {
    Steem.api.setOptions({url: 'https://api.steemit.com'});
  }
  
  getAccount(name: string): any {
    return Steem.api.getAccountsAsync([name]).then((res)=>res);
  }
  
  /*getAccount(id: number): any {
    return Steem.api.getAccountReferences(id, function(err, res) {
      return res;
    });
  }*/
}