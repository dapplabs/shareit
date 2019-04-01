import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  isLinear = true;
  upload_form = new FormGroup({});

  fileTypes: ["Video","Application", "Game" , "Document"];

  fileSubtypes: [
    {
      type: "Video",
      subtypes: ["Anime", "Movie", "Serie", "Documental", "Tutorial"]
    },
    {
      type: "Application",
      subtypes: ["Game", "Application", "Serie", "Documental", "Tutorial"]
    }
  ];

  constructor(private changeDetectorRef: ChangeDetectorRef, private formBuilder: FormBuilder) {
    setInterval(() => {
      // require view to be updated
      this.changeDetectorRef.markForCheck();
    }, 500);
  }
  
  createFormGroup(){
    return new FormGroup({
      categoryForm: new FormGroup({
        fileType: new FormControl('', Validators.required)
      }),
      postForm: new FormGroup({
        title: new FormControl('', Validators.required),
        body: new FormControl('', Validators.required),
        image: new FormControl('', Validators.required),
      }),
      fileForm: new FormGroup({
        filehash: new FormControl('', Validators.required),
        tfilehash: new FormControl('', Validators.required),
        subtitles: this.formBuilder.group({
          sub_titles: this.formBuilder.array([])
        }),
        body: new FormControl('', Validators.required),
      }),
      userForm: new FormGroup({})
    });
  }

  ngOnDestroy() {
    this.changeDetectorRef.detach();
  }

  ngOnInit() {
  }
}
