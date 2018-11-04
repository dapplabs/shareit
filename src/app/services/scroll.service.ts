import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  // Observable string sources
  private scrollAnnouncedSource  = new Subject<string>();
  // Observable string streams
  scrollAnnounced$ = this.scrollAnnouncedSource.asObservable();

  // Service message commands
  announceScroll(scroll: string) {
    this.scrollAnnouncedSource.next(scroll);
  }
}