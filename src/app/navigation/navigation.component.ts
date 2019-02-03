import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScrollService } from 'src/app/services/scroll.service';

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
    
  constructor(private breakpointObserver: BreakpointObserver, private scrollContentService: ScrollService) {

  }

  langs: any[] = [
    {value: 'es', viewValue: 'Spanish'},
    {value: 'en', viewValue: 'English'},
    {value: 'it', viewValue: 'Italian'}
  ];

  onScroll() {
    this.scrollContentService.announceScroll('scrolled');
  }
}
