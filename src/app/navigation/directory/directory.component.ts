import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DirectoryService } from 'src/app/services/directory.service';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
})
export class DirectoryComponent implements OnInit {
  @ViewChild('grid-container') elementView;
  posts = [];
  breakpoint = 0;

  lastPermLink = '';
  lastAuthor = '';
  finished = false;

  constructor(private directoryService: DirectoryService, private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpoint = window.innerWidth/350
    this.directoryService.getPosts(this.lastPermLink, this.lastAuthor).then((result) => {
        this.posts = result;
    });
  }

  //This method should be called when scroll down the grid...
  onScroll () {
    this.getCards();
  }

  onResize(event) {
    this.breakpoint = event.target.innerWidth/350;
  }
  
  private getCards(){
    if(this.finished) return;
    this.directoryService.getPosts(this.lastPermLink, this.lastAuthor).then((result) => {
      this.lastAuthor = result[result.length -1].author;
      this.lastPermLink = result[result.length -1].permlink;
      this.posts.push(result);
    });
  }

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        var cards = [];
        this.posts.forEach(element => {
          cards.push({ title: element.title, cols: 1, rows: 1, content: element.body, votes: element.net_votes });
        });
        return cards;
      }
      var cards = [];
      this.posts.forEach(element => {
        cards.push({ title: element.title, cols: 1, rows: 1, content: element.body, votes: element.net_votes });
      });
      return cards;
    })
  );
}
