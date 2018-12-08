import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  text: string = "";
  constructor() { }

  ngOnInit() {
    this.getText();
  }

  getText(){
    // read text from URL location
    var self = this;
    var request = new XMLHttpRequest();
    request.open('GET', 'https://raw.githubusercontent.com/marce1994/MyPWA/master/README.md', true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
              self.text = request.responseText;
            }
        }
    }
}
}
