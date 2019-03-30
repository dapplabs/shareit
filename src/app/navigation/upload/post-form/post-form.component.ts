import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpRequest, HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  post_form: FormGroup;

  _title: FormControl;
  _body: FormControl;
  _imageHash: FormControl;
  _season: FormControl;
  _episode: FormControl;

  get cover(): string{
    return this._imageHash.valid? 'https://shareit.ddns.net/ipfs/'+this._imageHash.value:'https://i.ebayimg.com/images/g/kZ8AAOSwWotbwxny/s-l1600.jpg';
  }

  get title(): string{
    return this._title.valid? this._title.value:'An awsome title';
  }

  get body(): string{
    return this._body.valid? this._body.value:'An awsone description';
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.initFormControls();
    this.post_form = new FormGroup({
      title: this._title,
      body: this._body,
      imageHash: this._imageHash,
      season: this._season,
      episode: this._episode
   });
  }

  initFormControls(){
    this._title = new FormControl('',Validators.required);
    this._body = new FormControl('',Validators.required);
    this._imageHash = new FormControl('',Validators.required);
    this._season = new FormControl('');
    this._episode = new FormControl('');
  }

  uploadPortada(files){
    var file = files[0];
    var self = this;
    const formData = new FormData();
    formData.append(file.name, file);
    
    this.http.request(
      new HttpRequest('POST', `https://shareit.ddns.net/api/upload`,
        formData,
        { reportProgress: true })
    ).subscribe(event => {
      switch (event.type) {
        case HttpEventType.Response:
          self._imageHash.setValue(event.body[Object.keys(event.body)[0]]);
          break;
        default:
          console.log(HttpEventType[event.type]);
          break;
      }
    });
  }

}
