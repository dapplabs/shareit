import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Steem from '../../../../node_modules/steem/lib';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  //hash: string = "";
  author: string = "";
  permlink: string = "";
  post: any = {};

  ipfsServers = [
    "https://shareit-network.ddns.net/ipfs/",
  ];
  loaded = false;

  replies = [];

  private sub: any;

  constructor(private route: ActivatedRoute) {
    Steem.api.setOptions({ url: 'https://api.steemit.com' });
  }

  public GetReplies(author: string, permlink: string) {
    var self = this;
    Steem.api.getContentReplies(author, permlink, function (err, result) {
      console.log(err, result);
      self.replies = result.map((res)=>{
        return {
          author: res.author,
          body: res.body,
          title: 'reputation: '+ Steem.formatter.reputation(res.author_reputation) +' mana: ' + res.total_vote_weight,
          tags: []
        }});
    });
  }

  public GetPost() {
    var self = this;
    Steem.api.getContent(this.author, this.permlink, function (err, result) {
      console.log(err, result, "sdfsdfdsf");
      self.post = {
        author: result.author,
        body: result.body.split("}}").pop(),
        title: result.title,
        tags: JSON.parse(result.json_metadata).tags,
        hash: JSON.parse(result.json_metadata).ipfshash,
        seasonepisode: JSON.parse(result.json_metadata).seasonepisode
      };
      console.log(JSON.parse(result.json_metadata).tags);
      self.replies = result.replies;
      console.log(self.replies);
      if (self.permlink !== undefined && self.author !== undefined && self.ipfsServers[0] !== undefined) {
        self.loaded = true;
        self.GetReplies(self.author, self.permlink);
      }
    });
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.author = params['author'];
      this.permlink = params['permlink'];
      this.GetPost();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}