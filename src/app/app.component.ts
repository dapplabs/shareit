import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ShaReIt';
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer){
    this.matIconRegistry.addSvgIcon(
      'github-circle',
      this.domSanitizer.bypassSecurityTrustResourceUrl("./../assets/github-circle.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'steemit',
      this.domSanitizer.bypassSecurityTrustResourceUrl("./../assets/steemit.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'webtorrent',
      this.domSanitizer.bypassSecurityTrustResourceUrl("./../assets/webtorrent.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'ipfs-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl("./../assets/ipfs-logo-vector-ice.svg")
    );
  }
}
