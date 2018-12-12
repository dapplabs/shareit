import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Steem from '../../../../node_modules/steem/lib';
declare const WebTorrent:any;
declare var $: any;

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  @ViewChild('VideoPlayer') VideoPlayer: ElementRef;

  author: string = "";
  permlink: string = "";
  post: any = {};
  webtorrent: any = {};
  file: any;

  textPeers: string = "";
  percent: number = 0;
  remaining: number = 0;
  downloaded: string = "";
  length: string = "";
  downloadSpeed: string = "";
  uploadSpeed: string = "";

  ipfsServers = [
    "https://shareit-network.ddns.net/ipfs/",
  ];
  loaded = false;

  replies = [];

  private sub: any;

  constructor(private route: ActivatedRoute) {
    this.webtorrent = new WebTorrent();
    console.log(this.webtorrent);
    Steem.api.setOptions({ url: 'https://api.steemit.com' });
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

  public async OnTorrent(){
    var self = this;

    var torrentId = 'https://shareit-network.ddns.net/ipfs/QmaJmQqiQs3MXS84xEVd1XAzuFdbB5HNq3jrZQhgJx9nZn';

    this.webtorrent.add(torrentId, function (torrent) {
      torrent.addWebSeed("https://shareit-network.ddns.net/ipfs/QmV675T4F5WDBE64UCT3kWuBeVyzDka3KPFYuPBqDBYFXT");
      console.log("asd");  
      // Torrents can contain many files. Let's use the .mp4 file
      /*torrent.files.find(function (file) {
        console.log("file",file);
        file.getBlob(function callback (err, blob) {
          self.file = blob;
        })
        /*file.getBlobURL(function callback (url) {
          self.file = url;
        })*/
      /*})*/
      // Torrents can contain many files. Let's use the .mp4 file
      var file = torrent.files.find(function (file) {
        return file.name.endsWith('.mp4')
      })

      // Stream the file in the browser
      file.renderTo('#VideoPlayer')

      // Trigger statistics refresh
      torrent.on('done', onDone)
      setInterval(onProgress, 500)
      onProgress()

      // Statistics
      function onProgress () {
        // Peers
        self.textPeers = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')

        // Progress
        self.percent = Math.round(torrent.progress * 100 * 100) / 100;
        
        self.downloaded = self.prettyBytes(torrent.downloaded)
        self.length = self.prettyBytes(torrent.length)

        // Remaining time
        
        if (torrent.done) {
          self.remaining = 0;
        } else {
          self.remaining = torrent.timeRemaining / 1000;
          //remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
          //remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
        }

        // Speed rates
        self.downloadSpeed = self.prettyBytes(torrent.downloadSpeed) + '/s'
        self.uploadSpeed = self.prettyBytes(torrent.uploadSpeed) + '/s'
      }
      function onDone () {
        //$body.className += ' is-seed'
        onProgress()
      }
    })
    
  }

  // Human readable bytes util
  prettyBytes(num) {
    var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    if (neg) num = -num
    if (num < 1) return (neg ? '-' : '') + num + ' B'
    exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
    num = Number((num / Math.pow(1000, exponent)).toFixed(2))
    unit = units[exponent]
    return (neg ? '-' : '') + num + ' ' + unit
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
        wthash: JSON.parse(result.json_metadata).wthash,
        seasonepisode: JSON.parse(result.json_metadata).seasonepisode
      };
      console.log(JSON.parse(result.json_metadata).tags);
      self.replies = result.replies;
      console.log(self.replies);
      if (self.permlink !== undefined && self.author !== undefined && self.ipfsServers[0] !== undefined) {
        self.loaded = true;
        self.GetReplies(self.author, self.permlink);
        self.OnTorrent();
      }
    });
  }
}