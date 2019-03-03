import { Component, OnInit, ViewChild, ElementRef, ApplicationRef, ChangeDetectorRef, DoCheck, Sanitizer } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Steem from '../../../../node_modules/steem/lib';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '../../../../node_modules/@angular/platform-browser';
import { getGateways } from '../../utils/ipfs.checker';

declare const WebTorrent: any;
declare const moment: any;
declare var $: any;

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  @ViewChild('VideoPlayer') VideoPlayer: ElementRef;
  @ViewChild('progressbar') ProgressBar: ElementRef;

  author: string = "";
  permlink: string = "";
  post: any = {};
  webtorrent: any = {};
  file: any;

  textPeers = new BehaviorSubject<string>("");
  percent = new BehaviorSubject<number>(0);
  remaining = new BehaviorSubject<string>("");
  downloaded = new BehaviorSubject<string>("");
  length = new BehaviorSubject<string>("");
  downloadSpeed = new BehaviorSubject<string>("");
  uploadSpeed = new BehaviorSubject<string>("");
  ended = new BehaviorSubject<boolean>(false);

  ipfsServers = [
    "https://shareit-network.ddns.net/ipfs/",
    "https://ipfs.io/ipfs/",
    "https://gateway.ipfs.io/ipfs/",
    "https://ipfs.infura.io/ipfs/",
    "https://rx14.co.uk/ipfs/",
    "https://xmine128.tk/ipfs/",
    "https://upload.global/ipfs/",
    "https://ipfs.jes.xxx/ipfs/",
    "https://catalunya.network/ipfs/",
    "https://siderus.io/ipfs/",
    "https://www.eternum.io/ipfs/",
    "https://hardbin.com/ipfs/:hash",
    "https://ipfs.macholibre.org/ipfs/",
    "https://ipfs.works/ipfs/",
    "https://ipfs.work/ipfs/",
    "https://ipfs.wa.hle.rs/ipfs/",
    "https://api.wisdom.sh/ipfs/",
    "https://gateway.blocksec.com/ipfs/",
    "https://ipfs.renehsz.com/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
    "https://ipns.co/",
    "https://ipfs.netw0rk.io/ipfs/",
    "https://gateway.swedneck.xyz/ipfs/"
    //...
  ];

  loaded = false;

  replies = [];

  private sub: any;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private changeDetectorRef: ChangeDetectorRef, private http: HttpClient) {
    setInterval(() => {
      // require view to be updated
      this.changeDetectorRef.markForCheck();
    }, 500);

    this.webtorrent = new WebTorrent();
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
    this.changeDetectorRef.detach();
    this.webtorrent.destroy();
    this.sub.unsubscribe();
  }

  public OnTorrent() {
    var self = this;

    var torrentId = this.ipfsServers[0] + this.post.thash;
    var webseed = this.ipfsServers[0] + this.post.hash;

    this.webtorrent.add(torrentId, function (torrent) {
      torrent.addWebSeed(webseed);

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
      function onProgress() {
        self.textPeers.next(torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers'));
        self.percent.next(Math.round(torrent.progress * 100 * 100) / 100)
        self.downloaded.next(self.prettyBytes(torrent.downloaded))
        self.length.next(self.prettyBytes(torrent.length))

        // Remaining time
        var remaining
        if (torrent.done) {
          remaining = 'Done.'
        } else {
          remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
          remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
        }
        self.remaining.next(remaining);

        // Speed rates
        self.downloadSpeed.next(self.prettyBytes(torrent.downloadSpeed) + '/s')
        self.uploadSpeed.next(self.prettyBytes(torrent.uploadSpeed) + '/s')
      }
      function onDone() {
        self.ended.next(true);
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
      self.replies = result.map((res) => {
        return {
          author: res.author,
          body: res.body,
          title: 'reputation: ' + Steem.formatter.reputation(res.author_reputation) + ' mana: ' + res.total_vote_weight,
          tags: []
        }
      });
    });
  }

  public GetPost() {
    var self = this;
    var ipfsServer = self.ipfsServers[0];
    Steem.api.getContent(this.author, this.permlink, function (err, result) {
      self.post = {
        author: result.author,
        body: result.body.split("}}").pop(),
        title: result.title,
        tags: JSON.parse(result.json_metadata).tags,
        hash: JSON.parse(result.json_metadata).ipfshash,
        thash: JSON.parse(result.json_metadata).ipfsthash,
        seasonepisode: JSON.parse(result.json_metadata).seasonepisode,
        subtitles: new Array<Blob>()
      };

      var metadata = JSON.parse(result.json_metadata);
      if ('subtitles' in metadata) {
        metadata.subtitles.map(function (sub) {
          self.http.request(new HttpRequest('GET', ipfsServer + sub.file, { responseType: 'blob' })).subscribe(event => {
            if (event.type === HttpEventType.DownloadProgress) {
              console.log('descargando...');
            }
            else if (event.type === HttpEventType.Response) {
              sub.archive = self.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.body));;
              console.log(sub);
              self.post.subtitles.push(sub);
            }
          });
        });
      }

      self.OnTorrent();
      self.replies = result.replies;

      if (self.permlink !== undefined && self.author !== undefined && self.ipfsServers[0] !== undefined) {
        self.loaded = true;
        self.GetReplies(self.author, self.permlink);
      }
    });
  }
}