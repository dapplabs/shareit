import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScrollService } from 'src/app/services/scroll.service';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
    
  constructor(private translate: TranslateService, private breakpointObserver: BreakpointObserver, private scrollContentService: ScrollService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');

         // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use('en');
  }

  selected = 'en';

  langs: any[] = [
    {value: 'es', viewValue: 'Spanish'},
    {value: 'en', viewValue: 'English'},
    {value: 'it', viewValue: 'Italian'}
  ];

  changeLanguage(lang: any){
    this.translate.use(lang.value);
  }

  onScroll() {
    this.scrollContentService.announceScroll('scrolled');
  }
}
