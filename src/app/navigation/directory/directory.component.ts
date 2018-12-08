import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { map  } from 'rxjs/operators';
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
  
  lastPermLink = '';
  lastAuthor = '';
  finished = false;
  
  constructor(private directoryService: DirectoryService, private breakpointObserver: BreakpointObserver, scrollContentService: ScrollService) {
    this.subscription = scrollContentService.scrollAnnounced$.subscribe(
      () => {
        this.getCards();
      }
    );
  }

  ngOnInit() {
    this.breakpoint = window.innerWidth/350;
    this.directoryService.getPosts(this.breakpoint*3,this.lastPermLink, this.lastAuthor).then((result) => {
        this.posts = result.map(function(element){
          return {
            title: element.title,
            body: element.body,
            permlink: element.permlink,
            author: element.author,
            cols: 1,
            rows: 1,
            votes: element.net_votes,
            ipfshash: JSON.parse(element.json_metadata).ipfshash
          }
        });
        console.log(this.posts);
    });
    
  }

  onResize(event) {
    this.breakpoint = event.target.innerWidth/350;
  }
  
  private getCards(){
    if(this.finished) return;
    this.directoryService.getPosts(this.breakpoint*3,this.lastPermLink, this.lastAuthor).then((result) => {
      this.lastAuthor = result[result.length -1].author;
      this.lastPermLink = result[result.length -1].permlink;
      this.posts = this.posts.concat(result);
    });
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
