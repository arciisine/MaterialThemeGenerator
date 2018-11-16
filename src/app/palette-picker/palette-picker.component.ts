import { Component, OnInit } from '@angular/core';
import * as tinycolor from 'tinycolor2';
import { ThemeService } from '../theme.service';

type RGBA = tinycolor.ColorFormats.RGBA;
export interface Palette {
  [key: string]: {
    key: string,
    hex: string,
    isLight: boolean
  };
}

export interface AllPalette {
  primary: Palette;
  accent: Palette;
  warn: Palette;
  lightText: Palette;
  darkText: Palette;
}

@Component({
  selector: 'app-palette-picker',
  templateUrl: './palette-picker.component.html',
  styleUrls: ['./palette-picker.component.scss']
})
export class PalettePickerComponent implements OnInit {

  static MIX_AMOUNTS_PRIMARY = {
    50: [true, 12],
    100: [true, 30],
    200: [true, 50],
    300: [true, 70],
    400: [true, 85],
    500: [true, 100],
    600: [false, 87],
    700: [false, 70],
    800: [false, 54],
    900: [false, 25]
  };

  static MIX_AMOUNTS_SECONDARY = {
    A100: [15, 80, 65],
    A200: [15, 80, 55],
    A400: [15, 100, 45],
    A700: [15, 100, 40]
  };

  primaryColor: string;
  primaryColorPalette: Palette;

  accentColor: string;
  accentColorPalette: Palette;

  warnColor: string;
  warnColorPalette: Palette;

  lightTextColor: string;
  lightTextColorPalette: Palette;

  darkTextColor: string;
  darkTextColorPalette: Palette;

  backdrop = false;

  paletteKeys = [...Object.keys(PalettePickerComponent.MIX_AMOUNTS_PRIMARY), ...Object.keys(PalettePickerComponent.MIX_AMOUNTS_SECONDARY)];

  constructor(private service: ThemeService) { }

  ngOnInit() {
    this.setColor('primary', '#48a42b');
    this.setColor('accent', '#a81561');
    this.setColor('warn', '#ff0000');
    this.setColor('lightText', '#ffffff');
    this.setColor('darkText', '#111111');
  }

  addBackdrop() {
    this.backdrop = true;
  }

  removeBackdrop() {
    this.backdrop = false;
  }

  emit() {
    this.service.palette = {
      primary: this.primaryColorPalette,
      accent: this.accentColorPalette,
      warn: this.warnColorPalette,
      lightText: this.lightTextColorPalette,
      darkText: this.darkTextColorPalette,
    };
  }

  setColor(field: string, val: string) {
    this[`${field}Color`] = val;
    this[`${field}ColorPalette`] = this.computeTheme(val);
    this.emit();
  }

  multiply(rgb1: RGBA, rgb2: RGBA) {
    rgb1.b = Math.floor(rgb1.b * rgb2.b / 255);
    rgb1.g = Math.floor(rgb1.g * rgb2.g / 255);
    rgb1.r = Math.floor(rgb1.r * rgb2.r / 255);
    return tinycolor('rgb ' + rgb1.r + ' ' + rgb1.g + ' ' + rgb1.b);
  }

  private computeTheme(color: string): Palette {
    const baseLight = tinycolor('#ffffff');
    const baseDark = this.multiply(tinycolor(color).toRgb(), tinycolor(color).toRgb());
    const [, , , baseTriad] = tinycolor(color).tetrad();

    const primary = Object.keys(PalettePickerComponent.MIX_AMOUNTS_PRIMARY)
      .map(k => {
        const [light, amount] = PalettePickerComponent.MIX_AMOUNTS_PRIMARY[k];
        return [k, tinycolor.mix(light ? baseLight : baseDark, tinycolor(color), amount)] as [string, tinycolor.Instance];
      });

    const accent = Object.keys(PalettePickerComponent.MIX_AMOUNTS_SECONDARY)
      .map(k => {
        const [amount, sat, light] = PalettePickerComponent.MIX_AMOUNTS_SECONDARY[k];
        return [k, tinycolor.mix(baseDark, baseTriad, amount)
          .saturate(sat).lighten(light)] as [string, tinycolor.Instance];
      });

    return [...primary, ...accent].reduce((acc, [k, c]) => {
      acc[k] = {
        key: k,
        hex: c.toHexString(),
        isLight: c.isLight()
      };
      return acc;
    }, {});
  }
}
