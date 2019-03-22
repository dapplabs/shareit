import { Component, OnInit } from '@angular/core';
import { DynamicFormModel, DynamicFormService } from '@ng-dynamic-forms/core';
import { CATEGORY_FORM_MODEL } from './forms/form_model1';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {
  categoryFormModel: DynamicFormModel = CATEGORY_FORM_MODEL;
  categoryGroup: FormGroup;
  
  constructor(private formService: DynamicFormService) { }

  ngOnInit() {
    this.categoryGroup = this.formService.createFormGroup(this.categoryFormModel);
  }
}
