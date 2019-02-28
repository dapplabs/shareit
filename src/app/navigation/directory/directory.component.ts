import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DirectoryService } from 'src/app/services/directory.service';
import { ScrollService } from 'src/app/services/scroll.service';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
})

export class DirectoryComponent implements OnInit {
  posts = [];
  breakpoint = 0;
  subscription: Subscription;

  lastPermLink: string = "";
  lastAuthor: string = "";
  finished: boolean = true;

  constructor(private directoryService: DirectoryService, private breakpointObserver: BreakpointObserver, scrollContentService: ScrollService) {
    this.subscription = scrollContentService.scrollAnnounced$.subscribe(
      () => {
        this.getCards();
      }
    );
  }

  ngOnInit() {
    this.getCards();
  }

  onResize(event) {
    this.breakpoint = event.target.innerWidth / 300;
  }

  private getCards() {
    this.breakpoint = window.innerWidth / 300;
    this.finished = false;

    var self = this;

    this.directoryService.getPosts(this.breakpoint * 3, this.lastPermLink, this.lastAuthor).then((result) => {
      this.finished = true;

      this.lastAuthor = result[result.length - 1].author;
      this.lastPermLink = result[result.length - 1].permlink;

      this.posts = this.posts.concat(result.map(function (element) {
        var metadata = JSON.parse(element.json_metadata);

        var SE = self.getSeasonEpisode(metadata.seasonepisode);

        return {
          title: element.title,
          body: element.body.split("}}").pop(),
          permlink: element.permlink,
          author: element.author,
          cols: 1,
          rows: 1,
          votes: element.net_votes,
          ipfshash: metadata.ipfshash,
          season: SE.season,
          episode: SE.episode
        }
      }));
    });
  }

  getSeasonEpisode(seasonepisode: string) {
    var season = '';
    var episode = '';

    var temp = '';
    for (let index = seasonepisode.length; index >= 0; index--) {
      if (("0123456789").includes(seasonepisode[index])) {
        temp += seasonepisode[index];
        console.log(temp);
      }

      if (seasonepisode[index] == 'E') {
        episode = 'Ep. ' + temp.split("").reverse().join("");
        temp = '';
      }

      if (seasonepisode[index] == 'S') {
        season = 'Sea.' + temp.split("").reverse().join("");
        temp = '';
        break;
      }
    }
    return { season, episode }
  }

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      var cards = [];
      this.posts.forEach(element => {
        element.cols = 1;
        element.rows = 1;
        cards.push(element);
      });
      return cards;
    })
  );
}
