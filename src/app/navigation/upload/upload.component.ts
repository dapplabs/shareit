import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CommentService } from 'src/app/services/comment.service';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  myform: FormGroup;

  title: FormControl;
  body: FormControl;
  tags: FormControl;
  username: FormControl;
  key: FormControl;
  hash: FormControl;

  constructor(private commentService: CommentService, private accountService: AccountService) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }

  createFormControls() {
    this.title = new FormControl('', Validators.required);
    this.body = new FormControl('', Validators.required);
    this.tags = new FormControl('', Validators.required);
    this.username = new FormControl('', Validators.required);
    this.key = new FormControl('', Validators.required);
    this.hash = new FormControl('', Validators.required);
  }

  createForm() {
    this.myform = new FormGroup({
      title: this.title,
      body: this.body, 
      tags: this.tags,
      username: this.username,
      key: this.key,
      hash: this.hash
    });
  }
  
  onSubmit() {
    if (this.myform.valid) {
      this.commentService.Post(
        this.username.value,
        this.key.value,
        "anime",
        this.title.value,
        this.body.value,
        { ipfshash: this.hash.value, tags: this.tags.value.replace(/ /g, "").split(",") },
        null
      );
    }
  }
}
