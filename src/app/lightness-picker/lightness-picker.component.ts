import { Component, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-lightness-picker',
  templateUrl: './lightness-picker.component.html',
  styleUrls: ['./lightness-picker.component.scss']
})
export class LightnessPickerComponent implements OnInit {

  lightness = new FormControl(true);

  @Output()
  updated = this.lightness.valueChanges;

  constructor() { }

  ngOnInit() {
  }

}
