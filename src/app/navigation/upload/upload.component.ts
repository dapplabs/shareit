import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';
import { AccountService } from 'src/app/services/account.service';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { FormBuilder, FormArray } from '@angular/forms';
var subsrt = require('subsrt');
var json = require('../../../assets/i18n/language-codes.json');

declare const WebTorrent: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  subformats: Array<string> = [];
  submitted: boolean = false;

  myform: FormGroup;
  subForm: FormGroup;

  get subtitles(): FormArray {
    return <FormArray>this.subForm.get('sub_titles');
  }

  languagecodes: Array<{ code: string, language: string }> = json;

  public progress: number = 0;
  public totalSize: any = {};
  public uploadedSize: any = {};
  public fileStatus: any = {};

  get filesstatus(): Array<string> {
    return (Object.values(this.fileStatus) as Array<string>)
  }
  public files = null;
  public filesKeys = null;
  webtorrent: any = {};

  title: FormControl;
  body: FormControl;
  tags: FormControl;
  username: FormControl;
  key: FormControl;
  hash: FormControl;
  torrenthash: FormControl;
  seasonepisode: FormControl;

  constructor(private formBuilder: FormBuilder, private commentService: CommentService, private accountService: AccountService, private http: HttpClient, private changeDetectorRef: ChangeDetectorRef) {
    this.webtorrent = new WebTorrent();
    this.subformats = subsrt.list();
    setInterval(() => {
      // require view to be updated
      this.changeDetectorRef.markForCheck();
    }, 500);
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
      seasonepisode: this.seasonepisode
    });
  }

  clearForm() {
    this.myform.reset();
    const subtitles = this.subForm.get('sub_titles') as FormArray;
    this.webtorrent = new WebTorrent();
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
  }

  upload(files) {
    if (files.length === 0)
      return;

    var arrayFiles = Array.from(files as Array<File>);

    if (arrayFiles.filter(x => (x as File).name.includes(".mp4")).length == 0) {
      alert("No mp4 files detexted");
      return;
    }

    if (arrayFiles.filter(x => (x as File).name.includes(".mp4")).length > 1) {
      alert("Just 1 file per post it's allowed");
      return;
    }

    for (let index = 0; index < arrayFiles.length; index++) {
      this.totalSize[arrayFiles[index].name] = arrayFiles[index].size;
      this.uploadedSize[arrayFiles[index].name] = 0;
    }

    var self = this;

    //Upload mp4 files...
    var videoFiles = arrayFiles.filter(x => (x as File).name.includes(".mp4"));
    for (let index = 0; index < videoFiles.length; index++) {
      self.fileStatus[videoFiles[index].name] = "processing";
      this.webtorrent.on('error', err => {
        self.fileStatus[videoFiles[index].name] = "error";
      })
      this.webtorrent.seed(videoFiles[index], function (torrent) {
        torrent.on('error', err => {
          self.fileStatus[videoFiles[index].name] = "error";
        })
        var torrentFile = new Blob([new Uint8Array(torrent.torrentFile)]);
        
        const formData = new FormData();

        formData.append(videoFiles[index].name, videoFiles[index]);
        formData.append(videoFiles[index].name + '.torrent', self.blobToFile(torrentFile, videoFiles[index].name + '.torrent'), videoFiles[index].name + '.torrent');
        const uploadReq = new HttpRequest('POST', `https://shareit-network.ddns.net/api/upload`, formData, {
          reportProgress: true,
        });
        self.totalSize[videoFiles[index].name] = videoFiles[index].size;
        self.http.request(uploadReq).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            self.uploadedSize[videoFiles[index].name] = event.loaded;
            self.fileStatus[videoFiles[index].name] = "uploading";

            var total = (Object.values(self.totalSize) as Array<number>).reduce(function (a, b) { return a + b; }, 0);
            var uploaded = (Object.values(self.uploadedSize) as Array<number>).reduce(function (a, b) { return a + b; }, 0);
            self.progress = Math.round(100 * uploaded / total);

            console.log(self.progress);
          }
          else if (event.type === HttpEventType.Response) {
            if(!event.ok){
              self.fileStatus[videoFiles[index].name] = "error";
            }

            self.fileStatus[videoFiles[index].name] = "uploaded";

            self.hash.setValue(event.body[Object.keys(event.body)[0]]);
            self.torrenthash.setValue(event.body[Object.keys(event.body)[1]]);

            self.files = Object.assign({}, self.files, event.body);
            self.filesKeys = Object.keys(self.files);
          }
        });
      })
    }

    //Upload subtitles...
    var subtitleFiles = [];
    arrayFiles.forEach(element => {
      var extension = element.name.split('.').pop();
      console.log(extension);
      console.log(extension, subsrt.list(), subsrt.list().includes(extension));
      if (subsrt.list().includes(extension)) {
        var ready = false;
        var result;
        var check = function () {
          if (ready === true) {
            var parsed = subsrt.convert(result, { format: 'vtt' });
            var blob = new Blob([parsed]);
            var file = self.blobToFile(blob, element.name.replace('.' + extension, '.vtt'));
            self.fileStatus[file.name] = "processing";
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
  
  public uploadSubtitle(file: File) {
    var self = this;
    const formData = new FormData();

    formData.append(file.name, file, file.name);
    const uploadReq = new HttpRequest('POST', `https://shareit-network.ddns.net/api/upload`, formData, {
      reportProgress: true,
    });
    self.totalSize[file.name] = file.size;
    self.http.request(uploadReq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        self.fileStatus[file.name] = "uploading";
        self.uploadedSize[file.name] = event.loaded;

        var total = (Object.values(self.totalSize) as Array<number>).reduce(function (a, b) { return a + b; }, 0);
        var uploaded = (Object.values(self.uploadedSize) as Array<number>).reduce(function (a, b) { return a + b; }, 0);
        self.progress = Math.round(100 * uploaded / total);

        console.log(self.progress);
      }
      else if (event.type === HttpEventType.Response) {
        if(!event.ok){
          self.fileStatus[file.name] = "error";
        }

        self.fileStatus[file.name] = "uploaded";

        self.addItem(Object.keys(event.body)[0], event.body[Object.keys(event.body)[0]]);

        self.files = Object.assign({}, self.files, event.body);
        self.filesKeys = Object.keys(self.files);
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
