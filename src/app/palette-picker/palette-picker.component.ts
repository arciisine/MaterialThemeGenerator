import { Component, OnInit } from '@angular/core';
import * as tinycolor from 'tinycolor2';

type RGBA = tinycolor.ColorFormats.RGBA;
interface Palette {
  [key: string]: {
    hex: string,
    darkContrast: boolean
  };
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

  secondaryColor: string;
  secondaryColorPalette: Palette;

  paletteKeys = [...Object.keys(PalettePickerComponent.MIX_AMOUNTS_PRIMARY), ...Object.keys(PalettePickerComponent.MIX_AMOUNTS_SECONDARY)];

  constructor() { }

  ngOnInit() {
    this.setPrimaryColor('#880000');
    this.setSecondaryColor('#008800');
  }

  setPrimaryColor(val: string) {
    this.primaryColor = val;
    this.primaryColorPalette = this.computeTheme(val);
  }

  setSecondaryColor(val: string) {
    this.secondaryColor = val;
    this.secondaryColorPalette = this.computeTheme(val);
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

    const secondary = Object.keys(PalettePickerComponent.MIX_AMOUNTS_SECONDARY)
      .map(k => {
        const [amount, sat, light] = PalettePickerComponent.MIX_AMOUNTS_SECONDARY[k];
        return [k, tinycolor.mix(baseDark, baseTriad, amount)
          .saturate(sat).lighten(light)] as [string, tinycolor.Instance];
      });

    return [...primary, ...secondary].reduce((acc, [k, c]) => {
      acc[k] = {
        hex: c.toHexString(),
        isLight: c.isLight()
      };
      return acc;
    }, {});
  }
}
