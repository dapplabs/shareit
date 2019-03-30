import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  isLinear = true;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    setInterval(() => {
      // require view to be updated
      this.changeDetectorRef.markForCheck();
    }, 500);
  }
  
  ngOnDestroy() {
    this.changeDetectorRef.detach();
  }

  ngOnInit() {
  }
}
