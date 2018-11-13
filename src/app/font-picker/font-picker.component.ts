import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, Form, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export interface FontSelection {
  target: string;
  family: string;
  variant: 'light' | 'regular' | 'medium';
  size: number;
  lineHeight?: number;
  capitalized: boolean;
  spacing: number;
}

export interface AllFontSelection {
  [key: string]: FontSelection;
}

@Component({
  selector: 'app-font-picker',
  templateUrl: './font-picker.component.html',
  styleUrls: ['./font-picker.component.scss']
})
export class FontPickerComponent implements OnInit {

  fonts: AllFontSelection = {
    display4: {
      target: 'display-4',
      family: 'Roboto',
      variant: 'light',
      size: 112,
      spacing: -1.5,
      capitalized: false
    },
    display3: {
      target: 'display-3',
      family: 'Roboto',
      variant: 'regular',
      size: 56,
      spacing: -.5,
      capitalized: false
    },
    display2: {
      target: 'display-2',
      family: 'Roboto',
      variant: 'regular',
      size: 45,
      lineHeight: 48,
      spacing: 0,
      capitalized: false
    },
    display1: {
      target: 'display-1',
      family: 'Roboto',
      variant: 'regular',
      size: 34,
      lineHeight: 40,
      spacing: .25,
      capitalized: false
    },
    headline: {
      target: 'headline',
      family: 'Roboto',
      variant: 'regular',
      size: 24,
      lineHeight: 32,
      spacing: 0,
      capitalized: false
    },
    title: {
      target: 'title',
      family: 'Roboto',
      variant: 'medium',
      size: 20,
      lineHeight: 32,
      spacing: 0.15,
      capitalized: false
    },
    subheading2: {
      target: 'subheading-2',
      family: 'Roboto',
      variant: 'regular',
      size: 16,
      lineHeight: 28,
      spacing: 0.15,
      capitalized: false
    },
    subheading1: {
      target: 'subheading-1',
      family: 'Roboto',
      variant: 'medium',
      size: 15,
      lineHeight: 24,
      spacing: .1,
      capitalized: false
    },
    body2: {
      target: 'body-1',
      family: 'Roboto',
      variant: 'medium',
      size: 14,
      lineHeight: 24,
      spacing: .25,
      capitalized: false
    },
    body1: {
      target: 'body-2',
      family: 'Roboto',
      variant: 'regular',
      size: 14,
      lineHeight: 20,
      spacing: .25,
      capitalized: false
    },
    button: {
      target: 'button',
      family: 'Roboto',
      variant: 'medium',
      size: 14,
      lineHeight: 14,
      spacing: 1.25,
      capitalized: true
    },
    caption: {
      target: 'caption',
      family: 'Roboto',
      variant: 'regular',
      size: 12,
      lineHeight: 20,
      spacing: .4,
      capitalized: false
    },
    input: {
      target: 'input',
      family: 'Roboto',
      variant: 'regular',
      size: undefined,
      lineHeight: 1.125,
      spacing: 1.5,
      capitalized: true
    }
  };

  keys = Object.keys(this.fonts);

  variants = ['regular', 'medium', 'light'];

  items: FormArray;

  all: FormGroup = new FormGroup({
    family: new FormControl()
  });

  @Output()
  updated: Observable<FontSelection[]>;

  constructor(fb: FormBuilder) {
    this.items = fb.array(this.keys.map(x =>
      fb.group({
        target: fb.control(this.fonts[x].target),
        family: fb.control(this.fonts[x].family),
        variant: fb.control(this.fonts[x].variant),
        lineHeight: fb.control(this.fonts[x].lineHeight),
        size: fb.control(this.fonts[x].size),
        spacing: fb.control(this.fonts[x].spacing),
        capitalized: fb.control(this.fonts[x].capitalized),
      })
    ));
    this.updated = this.items.valueChanges;
  }

  ngOnInit() {
    this.all.get('family').valueChanges.subscribe(family => {
      for (const item of this.items.controls) {
        item.patchValue({
          family
        });
      }
    });

    this.items.updateValueAndValidity();
  }
}

