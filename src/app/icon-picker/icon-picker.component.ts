import { Component, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

export type IconSelection = 'Filled' | 'Outlined' | 'Rounded' | 'TwoTone' | 'Sharp';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss']
})
export class IconPickerComponent implements OnInit {

  iconSet = new FormControl('Filled');
  opts = ['Filled', 'Outlined', 'Rounded', 'TwoTone', 'Sharp'];

  @Output()
  updated = this.iconSet.valueChanges;

  constructor() { }

  ngOnInit() {
  }

}
