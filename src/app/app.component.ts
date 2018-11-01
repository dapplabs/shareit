import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { TestService } from './services/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ShaReIt';
  
  joke: any;

  constructor(updates: SwUpdate, private test: TestService) {
    updates.available.subscribe(event => {
      updates.activateUpdate().then(() => {
        document.location.reload();
      });
    });
  }

  ngOnInit() {
    this.test.gimmeJokes().subscribe(
      res => {
        this.joke = res;
      }
    );
  }
}
