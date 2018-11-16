import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { ThemeService } from '../theme.service';
import { DEFAULT_FONTS, AllFontSelection } from './types';


@Component({
  selector: 'app-font-picker',
  templateUrl: './font-picker.component.html',
  styleUrls: ['./font-picker.component.scss']
})
export class FontPickerComponent implements OnInit {

  fonts: AllFontSelection = {};

  keys = Object.keys(DEFAULT_FONTS);

  variants = ['regular', 'medium', 'light'];

  items: FormArray;

  all: FormGroup = new FormGroup({
    family: new FormControl()
  });

  constructor(fb: FormBuilder, private service: ThemeService) {
    for (const k of Object.keys(DEFAULT_FONTS)) {
      this.fonts[k] = { ...DEFAULT_FONTS[k] };
    }

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
  }

  ngOnInit() {
    this.items.valueChanges.subscribe(x => {
      this.service.fonts = x;
    });

    this.service.fontsSet.subscribe(x => {
      this.items.setValue(x.map(f => Object.assign({}, DEFAULT_FONTS[f.target], f)));
    });

    this.all.get('family').valueChanges.subscribe(family => {
      for (const item of this.items.controls) {
        item.patchValue({ family });
      }
    });

    this.items.updateValueAndValidity();
  }
}

