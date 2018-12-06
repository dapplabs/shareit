import * as Steem from '../../../node_modules/steem/lib';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor() {
    Steem.api.setOptions({ url: 'https://api.steemit.com' });
  }

  getAccount(name: string): any {
    return Steem.api.getAccountsAsync([name]).then((res) => res);
  }

  login(userName: string, wif: string) {
    if(this.login_using_wif(userName, wif, "posting")){
      sessionStorage.setItem("username", userName);
      sessionStorage.setItem("wif", wif);
    }
  }

  logout(){
    sessionStorage.clear();
  }

  getUserName(){
    if (sessionStorage.getItem('username')) {
      return sessionStorage.getItem('username');
    } else {
      console.log('key dose not exists');
    }
  }

  getWIF(){
    if (sessionStorage.getItem('wif')) {
      return sessionStorage.getItem('wif');
    } else {
      console.log('key dose not exists');
    }
  }

  /**
 * Tests if an username/private key pair is correct
 * @param {String} username - username of the account
 * @param {String} wif - Private key used for login
 * @param {String} type - Type of the private key, can be "posting", "active" or "owner"
 * @return {boolean} valid - True if the password is correct, false if not (or if the account doesn't exists)
 */
  private login_using_wif(username, wif, type): boolean {
    // Get the private posting key
    return Steem.api.getAccounts([username], function (err, result) {
      // check if the account exists
      if (result.length !== 0) {
        // get the public posting key
        if (type === "posting")
          var pubWif = result[0].posting.key_auths[0][0];
        else if (type === "active")
          var pubWif = result[0].active.key_auths[0][0];
        else if (type === "owner")
          var pubWif = result[0].owner.key_auths[0][0];

        var valid = false;
        try {
          // Check if the private key matches the public one.
          valid = Steem.auth.wifIsValid(wif, pubWif)
        } catch (e) {
        }
        return valid;
      }
      return false;
    });
  }
}