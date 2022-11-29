import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-preview-controls',
  templateUrl: './preview-controls.component.html',
  styleUrls: ['./preview-controls.component.scss']
})
export class PreviewControlsComponent implements OnInit {
  addressForm = new UntypedFormGroup({
    large: new UntypedFormControl(false),
    quantity: new UntypedFormControl(10),
    name: new UntypedFormControl(null, Validators.required),
    street: new UntypedFormControl(null, Validators.required),
    city: new UntypedFormControl(null, Validators.required),
    state: new UntypedFormControl(null, Validators.required),
    postalCode: new UntypedFormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    shipping: new UntypedFormControl('free', Validators.required),
    tracking: new UntypedFormControl(true),
    arrival: new UntypedFormControl(new Date())
  });

  states = [
    {
      'name': 'Alabama',
      'abbreviation': 'AL'
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
