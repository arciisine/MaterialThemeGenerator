import { Injectable } from '@angular/core';
import { Palette } from './palette-picker/palette-picker.component';
import { IconSelection } from './icon-picker/icon-picker.component';
import { Subject, ReplaySubject, Observable } from 'rxjs';
import { FontSelection, DEFAULT_FONTS } from './font-picker/types';
import * as tinycolor from 'tinycolor2';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

type RGBA = tinycolor.ColorFormats.RGBA;
export interface MaterialPalette {
  [key: string]: {
    key: string,
    hex: string,
    isLight: boolean
  };
}

export interface SubPalette {
  main: string;
  lighter: string;
  darker: string;
}

declare var Sass;

export interface Theme {
  palette: Palette;
  fonts: FontSelection[];
  icons: IconSelection;
  lightness: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

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

  _palette: Palette;
  _fonts: FontSelection[];
  _icons: IconSelection = 'Filled';
  _lightness = true;

  theme = new ReplaySubject<Theme>();

  $palette = new Subject<Partial<Palette>>();
  $fonts = new Subject<FontSelection[]>();
  $icons = new Subject<string>();
  $lightness = new Subject<boolean>();
  $themeScss: Promise<void>;


  constructor(private http: HttpClient) {
    this.$themeScss = this.loadThemingScss();
  }

  loadThemingScss() {
    return this.http.get('/assets/_theming.scss', { responseType: 'text' })
      .pipe(
        map(x => {
          return x
            .replace(/\n/gmis, '??')
            .replace(/\$mat-([^:?]+)\s*:\s*\([? ]*50:[^()]*contrast\s*:\s*\([^)]+\)[ ?]*\);\s*?/g,
              (all, name) => name === 'grey' ? all : '')
            .replace(/\/\*.*?\*\//g, '')
            .split(/[?][?]/g)
            .map(l => l
              .replace(/^\s*(\/\/.*)?$/g, '')
              .replace(/^\$mat-blue-gray\s*:\s*\$mat-blue-grey\s*;\s*/g, '')
              .replace(/^\s*|\s*$/g, '')
              .replace(/:\s\s+/g, ': ')
            )
            .filter(l => !!l)
            .join('\n');
        }),
        map(txt =>
          Sass.writeFile('~@angular/material/theming', txt))
      ).toPromise();
  }

  emit() {
    this.theme.next({
      palette: this._palette,
      fonts: this._fonts,
      icons: this._icons,
      lightness: this._lightness
    });
  }

  set palette(pal: Palette) {
    this._palette = pal;
    this.emit();
  }

  get palette() {
    return this._palette;
  }

  set fonts(fonts: FontSelection[]) {
    this._fonts = fonts;
    this.emit();
  }

  get fonts() {
    return this._fonts;
  }

  set icons(icons: IconSelection) {
    this._icons = icons;
    this.emit();
  }

  get icons() {
    return this._icons;
  }

  set lightness(light: boolean) {
    this._lightness = light;
    this.emit();
  }

  get lightness() {
    return this._lightness;
  }

  multiply(rgb1: RGBA, rgb2: RGBA) {
    rgb1.b = Math.floor(rgb1.b * rgb2.b / 255);
    rgb1.g = Math.floor(rgb1.g * rgb2.g / 255);
    rgb1.r = Math.floor(rgb1.r * rgb2.r / 255);
    return tinycolor('rgb ' + rgb1.r + ' ' + rgb1.g + ' ' + rgb1.b);
  }

  /**
   *  Algorithm taken from https://github.com/mbitson/mcg/blob/master/scripts/controllers/ColorGeneratorCtrl.js#L237, (MIT)
   */
  getPalette(color: string): MaterialPalette {
    const baseLight = tinycolor('#ffffff');
    const baseDark = this.multiply(tinycolor(color).toRgb(), tinycolor(color).toRgb());
    const [, , , baseTriad] = tinycolor(color).tetrad();

    const primary = Object.keys(ThemeService.MIX_AMOUNTS_PRIMARY)
      .map(k => {
        const [light, amount] = ThemeService.MIX_AMOUNTS_PRIMARY[k];
        return [k, tinycolor.mix(light ? baseLight : baseDark, tinycolor(color), amount)] as [string, tinycolor.Instance];
      });

    const accent = Object.keys(ThemeService.MIX_AMOUNTS_SECONDARY)
      .map(k => {
        const [amount, sat, light] = ThemeService.MIX_AMOUNTS_SECONDARY[k];
        return [k, tinycolor.mix(baseDark, baseTriad, amount)
          .saturate(sat).lighten(light)] as [string, tinycolor.Instance];
      });

    return [...primary, ...accent].reduce((acc, [k, c]) => {
      acc[k] = c.toHexString();
      return acc;
    }, {});
  }

  fontRule(x: FontSelection) {
    const weight = x.variant === 'light' ? '300' : (x.variant === 'medium' ? '500' : '400');

    return !!x.size ?
      `mat-typography-level(${x.size}px, ${x.lineHeight}px, ${weight}, '${x.family}', ${(x.spacing / x.size).toFixed(4)}em)` :
      `mat-typography-level(inherits, ${x.lineHeight}, ${weight}, '${x.family}', 1.5px)`;
  }

  getTextColor(col: string) {
    return `$${tinycolor(col).isLight() ? 'dark' : 'light'}-primary-text`;
  }

  getScssPalette(name: string, p: SubPalette) {
    return `
$mat-${name}: (
  main: ${p.main},
  lighter: ${p.lighter},
  darker: ${p.darker},
  200: ${p.main}, // For slide toggle,
  contrast : (
    main: ${this.getTextColor(p.main)},
    lighter: ${this.getTextColor(p.lighter)},
    darker: ${this.getTextColor(p.darker)},
  )
);
$theme-${name}: mat-palette($mat-${name}, main, lighter, darker);`;
  }

  getTemplate(theme: Theme) {
    // tslint:disable:no-trailing-whitespace
    // tslint:disable:max-line-length
    const tpl = `/**
* Generated theme by Material Theme Generator
* https://material-theme-generator.travetto.io
*/

@import '~@angular/material/theming';
// Include the common styles for Angular Material. We include this here so that you only
// have to load a single css file for Angular Material in your app.

${Array.from(new Set((theme.fonts || []).map(x => x.family.replace(/ /g, '+'))))
        .map(x => `@import url('https://fonts.googleapis.com/css?family=${x}:300,400,500');`).join('\n')}

$fontConfig: (
  ${(theme.fonts || []).map(x => `${x.target}: ${this.fontRule(x)}`).join(',\n  ')}
);

$light-text: ${theme.palette.textLight};
$light-primary-text: $light-text;
$light-accent-text: rgba($light-primary-text, 0.7);
$light-disabled-text: rgba($light-primary-text, 0.5);
$light-dividers: rgba($light-primary-text, 0.12);
$light-focused: rgba($light-primary-text, 0.12);

$dark-text: ${theme.palette.textDark};
$dark-primary-text: rgba($dark-text, 0.87);
$dark-accent-text: rgba($dark-primary-text, 0.54);
$dark-disabled-text: rgba($dark-primary-text, 0.38);
$dark-dividers: rgba($dark-primary-text, 0.12);
$dark-focused: rgba($dark-primary-text, 0.12);

$mat-light-theme-foreground: (
  base:              black,
  divider:           $dark-dividers,
  dividers:          $dark-dividers,
  disabled:          $dark-disabled-text,
  disabled-button:   rgba($dark-text, 0.26),
  disabled-text:     $dark-disabled-text,
  elevation:         black,
  secondary-text:    $dark-accent-text,
  hint-text:         $dark-disabled-text,
  accent-text:       $dark-accent-text,
  icon:              $dark-accent-text,
  icons:             $dark-accent-text,
  text:              $dark-primary-text,
  slider-min:        $dark-primary-text,
  slider-off:        rgba($dark-text, 0.26),
  slider-off-active: $dark-disabled-text,
);

$mat-dark-theme-foreground: (
  base:              $light-text,
  divider:           $light-dividers,
  dividers:          $light-dividers,
  disabled:          $light-disabled-text,
  disabled-button:   rgba($light-text, 0.3),
  disabled-text:     $light-disabled-text,
  elevation:         black,
  hint-text:         $light-disabled-text,
  secondary-text:    $light-accent-text,
  accent-text:       $light-accent-text,
  icon:              $light-text,
  icons:             $light-text,
  text:              $light-text,
  slider-min:        $light-text,
  slider-off:        rgba($light-text, 0.3),
  slider-off-active: rgba($light-text, 0.3),
);

@include mat-core($fontConfig);

// Define the palettes for your theme using the Material Design palettes available in palette.scss
// (imported above). For each palette, you can optionally specify a default, lighter, and darker
// hue. Available color palettes: https://material.io/design/color/
${['primary', 'accent', 'warn'].map(x => this.getScssPalette(x, theme.palette[x])).join('\n')};

// Create the theme object (a Sass map containing all of the palettes).
$theme: ${!theme.lightness ? 'mat-dark-theme' : 'mat-light-theme'}($theme-primary, $theme-accent, $theme-warn);
$altTheme: ${!theme.lightness ? 'mat-light-theme' : 'mat-dark-theme'}($theme-primary, $theme-accent, $theme-warn);

@include angular-material-theme($theme);

.theme-alternate {
  @include angular-material-theme($altTheme);
}
`;
    // tslint:enable:no-trailing-whitespace
    // tslint:enable:max-line-length
    return tpl;
  }

  async compileScssTheme(src: string) {
    await this.$themeScss;
    return new Promise<string>((res, rej) =>
      Sass.compile(src.replace('@include angular-material-theme($altTheme);', ''), v => {
        if (v.status === 0) {
          res(v.text);
        } else {
          rej(v);
        }
      })
    );
  }

  fromExternal(val: string) {
    try {
      const json = JSON.parse(val);

      this.$lightness.next(json.lightness);
      this.$icons.next(json.icons);
      this.$palette.next(json.palette);
      this.$fonts.next(json.fonts);
    } catch (e) {
      console.error('Unable to read', val, e);
    }
  }

  toExternal() {
    const data = {
      palette: this.palette,
      fonts: this.fonts.map(x => {
        const keys = Object.keys(x).filter(k => k === 'target' || x[k] !== DEFAULT_FONTS[x.target][k]);
        return keys.reduce((acc, v) => {
          acc[v] = x[v];
          return acc;
        }, {});
      }),
      icons: this.icons,
      lightness: this.lightness
    };
    return JSON.stringify(data);
  }
}
