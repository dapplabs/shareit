import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';
import { AccountService } from 'src/app/services/account.service';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { FormBuilder, FormArray } from '@angular/forms';
var subsrt = require('subsrt');
var json = require('../../../assets/i18n/language-codes.json');
var CryptoJS = require("crypto-js");

declare const WebTorrent: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  submitted: boolean = false;

  myform: FormGroup;
  subForm: FormGroup;

  statusFiles = {
    fileStatus: {},
    uploadedSize: {},
    totalSize: {}
  };

  get generalProgress() {
    var total = (Object.values(this.statusFiles['totalSize']) as Array<number>).reduce(function (a, b) { return a + b; }, 0);
    var uploaded = (Object.values(this.statusFiles['uploadedSize']) as Array<number>).reduce(function (a, b) { return a + b; }, 0);
    return Math.round(100 * uploaded / total);
  }

  get subtitles(): FormArray {
    return <FormArray>this.subForm.get('sub_titles');
  }

  get subtitleFileFormatsExtensions(): Array<string> {
    return subsrt.list().map(x => '.' + x);
  }

  get subtitleFileFormats(): Array<string> {
    return subsrt.list();
  }

  get filesstatus(): Array<string> {
    if (this.statusFiles['fileStatus'])
      return (Object.values(this.statusFiles['fileStatus']) as Array<string>);
    else
      return new Array<string>();
  }

  languagecodes: Array<{ code: string, language: string }> = json;

  webtorrent: any = {};

  title: FormControl;
  body: FormControl;
  tags: FormControl;
  username: FormControl;
  key: FormControl;
  hash: FormControl;
  imagehash: FormControl;
  torrenthash: FormControl;
  seasonepisode: FormControl;

  constructor(private formBuilder: FormBuilder, private commentService: CommentService, private accountService: AccountService, private http: HttpClient, private changeDetectorRef: ChangeDetectorRef) {
    this.webtorrent = new WebTorrent();
    setInterval(() => { this.changeDetectorRef.markForCheck(); }, 1000);
  }

  ngOnInit() {
    this.subForm = this.formBuilder.group({
      sub_titles: this.formBuilder.array([])
    });
    this.createFormControls();
    this.createForm();
  }

  ngOnDestroy() {
    this.changeDetectorRef.detach();
    this.webtorrent.destroy();
  }

  createFormControls() {
    this.title = new FormControl('', Validators.required);
    this.body = new FormControl('', Validators.required);
    this.tags = new FormControl('', Validators.required);
    this.username = new FormControl('', Validators.required);
    this.key = new FormControl('', Validators.required);
    this.hash = new FormControl('', Validators.required);
    this.torrenthash = new FormControl('', Validators.required);
    this.seasonepisode = new FormControl('', Validators.required);
    this.imagehash = new FormControl('', Validators.required);
  }

  createForm() {
    this.myform = new FormGroup({
      subForm: this.subForm,
      title: this.title,
      body: this.body,
      tags: this.tags,
      username: this.username,
      key: this.key,
      hash: this.hash,
      torrenthash: this.torrenthash,
      seasonepisode: this.seasonepisode,
      imagehash : this.imagehash
    });
  }

  clearForm() {
    this.myform.reset();
    const subtitles = this.subForm.get('sub_titles') as FormArray;
    this.webtorrent = new WebTorrent();
    this.statusFiles = {
      fileStatus: {},
      uploadedSize: {},
      totalSize: {}
    };
    while (subtitles.length !== 0) {
      subtitles.removeAt(0);
    }
  }

  onSubmit() {
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

    var metadata = {
      seasonepisode: this.seasonepisode.value.toUpperCase(),
      ipfshash: this.hash.value,
      ipfsthash: this.torrenthash.value,
      coverimagehash: this.imagehash.value,
      tags: this.tags.value.replace(/ /g, "").split(","),
      subtitles: array
    }

    if (this.myform.valid) {
      this.commentService.Post(
        this.username.value,
        this.key.value,
        "shareit",
        this.title.value,
        this.body.value,
        metadata
      );
    }

    this.submitted = true;
    this.clearForm();
  }

  createItem(filename: string, hash: string): FormGroup {
    var form = this.formBuilder.group({
      fileName: [''],
      language: [''],
      hash: ['']
    });
    form.get('fileName').setValue(filename);
    form.get('hash').setValue(hash);
    return form;
  }

  removeItem(index: number): void {
    const subtitles = this.subForm.get('sub_titles') as FormArray;
    subtitles.removeAt(index);
  }

  addItem(filename: string, hash: string): void {
    this.subtitles.push(this.createItem(filename, hash));
    console.log(this.subtitles);
  }

  uploadPortada(files){
    var file = files[0];
    var self = this;
    const formData = new FormData();
    formData.append(file.name, file);
    
    this.http.request(
      new HttpRequest('POST', `https://shareit-network.ddns.net/api/upload`,
        formData,
        { reportProgress: true })
      /*new HttpRequest('POST', `https://steemitimages.com/`+this.username.value + '/' + this.key.value,
        formData,
        { reportProgress: true })*/
    ).subscribe(event => {
      self.updateFileUploadStatus(file, event);
      switch (event.type) {
        case HttpEventType.Response:
          self.updateFileUploadStatus(file, event);
          self.imagehash.setValue(event.body[Object.keys(event.body)[0]]);
          break;
        default:
          console.log(HttpEventType[event.type]);
          break;
      }
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
            var file = self.blobToFile(blob, element.name.replace('.' + extension, '.vtt'));

            self.statusFiles['fileStatus'][file.name] = "processing";

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
      self.addFileToFileStatus(file);
      this.webtorrent.seed(file, function (torrent) {
        var torrentFileBlob = new Blob([new Uint8Array(torrent.torrentFile)]);
        var torrentFile = self.blobToFile(torrentFileBlob, file.name + '.torrent');
        const formData = new FormData();
        formData.append(file.name, file);
        formData.append(file.name + '.torrent', torrentFile, file.name + '.torrent');

        self.http.request(
          new HttpRequest('POST', `https://shareit-network.ddns.net/api/upload`,
            formData,
            { reportProgress: true })
        ).subscribe(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              self.updateFileUploadStatus(file, event);
              break;
            case HttpEventType.Response:
              self.updateFileUploadStatus(file, event);
              self.hash.setValue(event.body[Object.keys(event.body)[0]]);
              self.torrenthash.setValue(event.body[Object.keys(event.body)[1]]);
              break;
            default:
              console.log(HttpEventType[event.type]);
              break;
          }
        });
      });
    });
  }

  updateFileUploadStatus(file: File, event) {
    this.statusFiles['uploadedSize'][file.name] = event.loaded;
    if (event.type === HttpEventType.UploadProgress)
      this.statusFiles['fileStatus'][file.name] = "uploading";
    if (event.type === HttpEventType.Response) {
      this.statusFiles['fileStatus'][file.name] = event.ok ? "uploaded" : "error";
    }
  }

  addFileToFileStatus(file: File) {
    this.statusFiles['fileStatus'][file.name] = "processing";
    this.statusFiles['totalSize'][file.name] = file.size;
    this.statusFiles['uploadedSize'][file.name] = 0;
  }

  public uploadSubtitle(file: File) {
    var self = this;
    const formData = new FormData();

    this.addFileToFileStatus(file);

    formData.append(file.name, file, file.name);

    self.http.request(
      new HttpRequest('POST', `https://shareit-network.ddns.net/api/upload`,
        formData,
        { reportProgress: true })
    ).subscribe(event => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          self.updateFileUploadStatus(file, event);
          break;
        case HttpEventType.Response:
          self.updateFileUploadStatus(file, event);
          self.addItem(Object.keys(event.body)[0], event.body[Object.keys(event.body)[0]]);
          break;
        default:
          console.log(HttpEventType[event.type]);
          break;
      }
    });
  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }
}
