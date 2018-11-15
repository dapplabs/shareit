import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  hash: string = "";
  ipfsServers = ["https://ipfs.io/ipfs/"];
  loaded = false;

  private sub: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      console.log(params);
      this.hash = params['hash']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
      if(this.hash !== undefined && this.ipfsServers[0] !== undefined)
        this.loaded = true;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
