import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ShaReIt';
  constructor(public loader: LoadingBarService, private translateService: TranslateService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer){
    translateService.setDefaultLang('en');
    translateService.use('en');
    this.matIconRegistry.addSvgIcon(
      'github-circle',
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/github-circle.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'steemit',
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/steemit.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'webtorrent',
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/webtorrent.svg")
    );
    this.matIconRegistry.addSvgIcon(
      'ipfs-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/ipfs-logo-vector-ice.svg")
    );
  }
}
