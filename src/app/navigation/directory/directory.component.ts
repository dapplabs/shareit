import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { DirectoryService } from 'src/app/services/directory.service';
import { AccountService } from 'src/app/services/account.service';
import { observable, Observable } from 'rxjs';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
})
export class DirectoryComponent implements OnInit {
  @ViewChild('grid-container') elementView;
  posts = [];
  users = [];
  
  breakpoint = 0;

  lastPermLink = '';
  lastAuthor = '';
  finished = false;

  constructor(private directoryService: DirectoryService, private accountService: AccountService, private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpoint = window.innerWidth/250
    this.directoryService.getPosts(this.lastPermLink, this.lastAuthor).then((result) => {
        this.posts = result;
    });
  }

  //This method should be called when scroll down the grid...
  onScroll () {
    this.getCards();
  }

  onResize(event) {
    this.breakpoint = event.target.innerWidth/250;
  }
  
  private getCards(){
    if(this.finished) return;
    this.directoryService.getPosts(this.lastPermLink, this.lastAuthor).then((result) => {
      this.lastAuthor = result[result.length -1].author;
      this.lastPermLink = result[result.length -1].permlink;
      this.posts.push(result);
    });
  }
}
