import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { blobToFile } from 'src/app/utils/general-utils';
import { HttpRequest, HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
declare const WebTorrent: any;
var subsrt = require('subsrt');
var json = require('../../../../assets/i18n/language-codes.json');

@Component({
  selector: 'app-file-form',
  templateUrl: './file-form.component.html',
  styleUrls: ['./file-form.component.scss']
})
export class FileFormComponent implements OnInit {
  file_form: FormGroup;

  _progress: number = 0;
  _progress_max: number = 100;
  
  get progress():number{
    return this._progress > 0? this._progress : 0;
  }
  get progressmax():number{
    return this._progress_max > 0? this._progress_max : 100;
  }
  _subForm: FormGroup;
  _thash;
  _hash;
  
  gateway: string;
  webtorrent: any;
  videosubtitles: Array<{ file:string, lang: string }>;
  languagecodes: Array<{ code: string, language: string }> = json;

  get subtitleFileFormatsExtensions(): Array<string> {
    return subsrt.list().map(x => '.' + x);
  }

  get subtitles(): FormArray {
    return <FormArray>this._subForm.get('sub_titles');
  }

  get subtitleFileFormats(): Array<string> {
    return subsrt.list();
  }

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnDestroy() {
    this.webtorrent.destroy();
  }

  ngOnInit() {
    this.gateway = "https://shareit.ddns.net/ipfs/";
    this.webtorrent = new WebTorrent();
    this.initForms();
    this.buildFormGroup();
  }
  
  initForms(){
    this._hash = new FormControl('', Validators.required);
    this._thash = new FormControl('', Validators.required);
    this._subForm = this.formBuilder.group({
      sub_titles: this.formBuilder.array([])
    });
  }

  buildFormGroup(){
    this.file_form = new FormGroup({
      hash: this._hash,
      thash: this._thash,
      subForm: this._subForm,
    });
  }

  uploadSubtitles(files) {
    if (files.length === 0)
      return;
    var arrayFiles = Array.from(files as Array<File>);
    var self = this;
    //Upload subtitles...
    var subtitleFiles = [];
    arrayFiles.forEach(element => {
      var extension = element.name.split('.').pop();
      if (this.subtitleFileFormats.includes(extension)) {
        var ready = false;
        var result;
        var check = function () {
          if (ready === true) {
            var parsed = subsrt.convert(result, { format: 'vtt' });
            var blob = new Blob([parsed]);
            var file = blobToFile(blob, element.name.replace('.' + extension, '.vtt'));
            subtitleFiles.push(file);
            self.uploadSubtitle(file);
            return;
          }
          setTimeout(check, 1000);
        }
        check();
        var reader = new FileReader();
        reader.onloadend = function (evt) {
          result = evt.currentTarget;
          result = result.result
          ready = true;
        };
        reader.readAsText(element);
      }
    });
  }

  uploadFile(files) {
    if (files.length === 0)
      return;
    var self = this;
    var arrayFiles = Array.from(files as Array<File>);
    arrayFiles.forEach(file => {
      this.webtorrent.seed(file, function (torrent) {
        var torrentFileBlob = new Blob([new Uint8Array(torrent.torrentFile)]);
        var torrentFile = blobToFile(torrentFileBlob, file.name + '.torrent');
        const formData = new FormData();
        formData.append(file.name, file);
        formData.append(file.name + '.torrent', torrentFile, file.name + '.torrent');

        self.http.request(
          new HttpRequest('POST', `https://shareit.ddns.net/api/upload`,
            formData,
            { reportProgress: true })
        ).subscribe(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              self._progress = event.loaded;
              self._progress_max = event.total;
              break;
            case HttpEventType.Response:
              //self.updateFileUploadStatus(file, event);
              self._hash.setValue(event.body[Object.keys(event.body)[0]]);
              self._thash.setValue(event.body[Object.keys(event.body)[1]]);
              var file = torrent.files.find(function (file) {
                return file.name.endsWith('.mp4')
              });
              file.renderTo('#VideoPlayer');
              break;
            default:
              console.log(HttpEventType[event.type]);
              break;
          }
        });
      });
    });
  }

  createItem(filename: string, hash: string): FormGroup {
    var form = this.formBuilder.group({
      fileName: [''],
      language: [''],
      hash: ['']
    });

    form.get('fileName').setValue(filename);
    form.get('fileName').disable();
    form.get('hash').setValue(hash);
    return form;
  }

  removeItem(index: number): void {
    const subtitles = this._subForm.get('sub_titles') as FormArray;
    subtitles.removeAt(index);
  }

  addItem(filename: string, hash: string): void {
    this.subtitles.push(this.createItem(filename, hash));
    console.log(this.subtitles);
  }

  public uploadSubtitle(file: File) {
    var self = this;
    const formData = new FormData();
    formData.append(file.name, file, file.name);

    this.http.request(
      new HttpRequest('POST', `https://shareit.ddns.net/api/upload`,
        formData,
        { reportProgress: true })
    ).subscribe(event => {
      switch (event.type) {
        case HttpEventType.Response:
          self.addItem(Object.keys(event.body)[0], event.body[Object.keys(event.body)[0]]);
          self.updateSubtitles();
          break;
        default:
          console.log(HttpEventType[event.type]);
          break;
      }
    });
  }

  updateSubtitles(){
    let array = [];

    for (let i = 0; i < this.subtitles.length; i++) {
      const element = this.subtitles.at(i);
      if (element.valid) {
        array.push(element.value);
      }
    }

    array = array.map(function (sub) {
      return { file: sub.hash, lang: sub.language };
    });

    this.videosubtitles = array;
  }
}
