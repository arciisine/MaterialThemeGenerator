import { Component, OnInit } from '@angular/core';
import { FormBuilder, Form, FormArray, FormGroup } from '@angular/forms';

export interface FontSelection {
  family: string;
  variant: 'light' | 'regular' | 'medium';
  size: number;
  capitalized: boolean;
  spacing: number;
}

@Component({
  selector: 'app-font-picker',
  templateUrl: './font-picker.component.html',
  styleUrls: ['./font-picker.component.scss']
})
export class FontPickerComponent implements OnInit {

  fonts: { [key: string]: FontSelection } = {
    h1: {
      family: 'Roboto',
      variant: 'light',
      size: 96,
      spacing: -1.5,
      capitalized: false
    },
    h2: {
      family: 'Roboto',
      variant: 'light',
      size: 60,
      spacing: -.5,
      capitalized: false
    },
    h3: {
      family: 'Roboto',
      variant: 'regular',
      size: 48,
      spacing: 0,
      capitalized: false
    },
    h4: {
      family: 'Roboto',
      variant: 'regular',
      size: 34,
      spacing: .25,
      capitalized: false
    },
    h5: {
      family: 'Roboto',
      variant: 'regular',
      size: 24,
      spacing: 0,
      capitalized: false
    },
    h6: {
      family: 'Roboto',
      variant: 'medium',
      size: 20,
      spacing: 0.15,
      capitalized: false
    },
    subtitle1: {
      family: 'Roboto',
      variant: 'regular',
      size: 16,
      spacing: 0.15,
      capitalized: false
    },
    subtitle2: {
      family: 'Roboto',
      variant: 'medium',
      size: 14,
      spacing: .1,
      capitalized: false
    },
    body1: {
      family: 'Roboto',
      variant: 'regular',
      size: 16,
      spacing: .5,
      capitalized: false
    },
    body2: {
      family: 'Roboto',
      variant: 'regular',
      size: 14,
      spacing: .25,
      capitalized: false
    },
    button: {
      family: 'Roboto',
      variant: 'medium',
      size: 14,
      spacing: 1.25,
      capitalized: true
    },
    caption: {
      family: 'Roboto',
      variant: 'regular',
      size: 12,
      spacing: .4,
      capitalized: false
    },
    overline: {
      family: 'Roboto',
      variant: 'regular',
      size: 10,
      spacing: 1.5,
      capitalized: true
    }
  };

  keys = Object.keys(this.fonts);

  variants = ['regular', 'medium', 'light'];

  items: FormArray;

  constructor(fb: FormBuilder) {
    this.items = fb.array(this.keys.map(x =>
      fb.group({
        family: fb.control(this.fonts[x].family),
        variant: fb.control(this.fonts[x].variant),
        size: fb.control(this.fonts[x].size),
        spacing: fb.control(this.fonts[x].spacing),
        capitalized: fb.control(this.fonts[x].capitalized),
      })
    ));
  }

  ngOnInit() {
  }

}

