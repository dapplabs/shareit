import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { CATEGORY_FORM_MODEL } from './forms/form_model1';
import { FormGroup, FormArray } from '@angular/forms';
import { POST_FORM_MODEL } from './forms/form_model2';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {
  categoryFormModel: DynamicFormModel = CATEGORY_FORM_MODEL;
  categoryGroup: FormGroup;

  postFormModel: DynamicFormModel = POST_FORM_MODEL;
  postGroup: FormGroup;
  
  postFormModel11: DynamicFormModel = POST_FORM_MODEL;
  postGroup11: FormGroup;

  constructor(private formService: DynamicFormService) { }

  ngOnInit() {
    this.categoryGroup = this.formService.createFormGroup(this.categoryFormModel);
    this.postGroup = this.formService.createFormGroup(this.postFormModel);
  }
}
