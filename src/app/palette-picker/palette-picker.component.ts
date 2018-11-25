import { Component, OnInit } from '@angular/core';
import { ThemeService, SubPalette } from '../theme.service';
import { FormGroup, FormControl, Form } from '@angular/forms';

import * as tinycolor from 'tinycolor2';

export interface Palette {
  primary: SubPalette;
  accent: SubPalette;
  warn: SubPalette;
  darkText: string;
  darkBackground: string;
  lightText: string;
  lightBackground: string;
}

@Component({
  selector: 'app-palette-picker',
  templateUrl: './palette-picker.component.html',
  styleUrls: ['./palette-picker.component.scss']
})
export class PalettePickerComponent implements OnInit {

  form: FormGroup;

  constructor(private service: ThemeService) {
    const ltLegVal = this.validateLegibility('light');
    const dkLegVal = this.validateLegibility('dark');

    this.form = new FormGroup({
      primary: new FormGroup({
        main: new FormControl(''),
        lighter: new FormControl(''),
        darker: new FormControl('')
      }),
      accent: new FormGroup({
        main: new FormControl(''),
        lighter: new FormControl(''),
        darker: new FormControl('')
      }),
      warn: new FormGroup({
        main: new FormControl(''),
        lighter: new FormControl(''),
        darker: new FormControl('')
      }),
      lightText: new FormControl('', []),
      lightBackground: new FormControl('', []),
      darkText: new FormControl('', []),
      darkBackground: new FormControl('', []),
    });

    this.form.setValidators([
      ltLegVal,
      dkLegVal
    ]);
  }

  validateLegibility(prefix: string) {
    return (form: FormGroup) => {
      const txt = form.get(`${prefix}Text`);
      const bg = form.get(`${prefix}Background`);
      let legible = this.service.isLegible(txt.value, bg.value);
      const tcol = tinycolor(txt.value);
      const bcol = tinycolor(bg.value);

      if (tcol.getLuminance() > bcol.getLuminance()) {
        legible = legible
          && this.service.isLegible(tcol.darken(10), bcol)
          && this.service.isLegible(tcol.darken(20), bcol);
      } else {
        legible = legible
          && this.service.isLegible(tcol.lighten(10), bcol)
          && this.service.isLegible(tcol.lighten(20), bcol);
      }

      return legible ? null : {
        [`illegible-${prefix}`]: {
          valid: false
        }
      };
    };
  }

  ngOnInit() {

    this.form.patchValue({
      primary: { main: '#cc33ca' },
      accent: { main: '#797979' },
      warn: { main: '#ff0000' },
      lightText: '#000000',
      lightBackground: '#fafafa',
      darkText: '#ffffff',
      darkBackground: '#2c2c2c'
    });

    this.form.valueChanges.subscribe(x => {
      this.service.palette = x;
    });

    this.service.$palette
      .subscribe(x => {
        if (x) {
          this.form.patchValue(x);
        }
      });
  }
}
