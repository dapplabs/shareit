import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feed.service';

export interface nyaa {
  title: string,
  category: string,
  downloads: string,
  size: string,
  link: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  nyaanew: nyaa[] = [];

  constructor(private feedService: FeedService) {
  }

  ngOnInit() {
    var self = this;
    this.feedService.getNyaaContent().then(function(nyaa){ self.nyaanew = nyaa });
  }

}
