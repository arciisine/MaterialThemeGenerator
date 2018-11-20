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
            .replace(/\n/gm, '??')
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

// Fonts
${Array.from(new Set((theme.fonts || []).map(x => x.family.replace(/ /g, '+'))))
        .map(x => `@import url('https://fonts.googleapis.com/css?family=${x}:300,400,500');`).join('\n')}
     
$fontConfig: (
  ${(theme.fonts || []).map(x => `${x.target}: ${this.fontRule(x)}`).join(',\n  ')}
);

// Foreground Elements

// Light Theme Text
$dark-text: ${theme.palette.lightText};
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

// Dark Theme text
$light-text: ${theme.palette.darkText};
$light-primary-text: $light-text;
$light-accent-text: rgba($light-primary-text, 0.7);
$light-disabled-text: rgba($light-primary-text, 0.5);
$light-dividers: rgba($light-primary-text, 0.12);
$light-focused: rgba($light-primary-text, 0.12);

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

// Background config
// Light bg
$light-background:    ${theme.palette.lightBackground};
$light-bg-darker-5:   darken($light-background, 5%);
$light-bg-darker-10:  darken($light-background, 10%);
$light-bg-darker-20:  darken($light-background, 20%);
$light-bg-darker-30:  darken($light-background, 30%);
$light-bg-lighter-5:  lighten($light-background, 5%);
$dark-bg-alpha-4:     rgba(${theme.palette.darkBackground}, 0.04);
$dark-bg-alpha-12:    rgba(${theme.palette.darkBackground}, 0.12);

$mat-light-theme-background: (
  background:               $light-background,
  status-bar:               $light-bg-darker-20,
  app-bar:                  $light-bg-darker-5,
  hover:                    $dark-bg-alpha-4,
  card:                     $light-bg-lighter-5,
  dialog:                   $light-bg-lighter-5,
  disabled-button:          $dark-bg-alpha-12,
  raised-button:            $light-bg-lighter-5,
  focused-button:           $dark-focused,
  selected-button:          $light-bg-darker-20,
  selected-disabled-button: $light-bg-darker-30,
  disabled-button-toggle:   $light-bg-darker-10,
  unselected-chip:          $light-bg-darker-10,
  disabled-list-option:     $light-bg-darker-10,
);

// Dark bg
$dark-background:     ${theme.palette.darkBackground};
$dark-bg-lighter-5:   lighten($dark-background, 5%);
$dark-bg-lighter-10:  lighten($dark-background, 10%);
$dark-bg-lighter-20:  lighten($dark-background, 20%);
$dark-bg-lighter-30:  lighten($dark-background, 30%);
$light-bg-alpha-4:    rgba(${theme.palette.lightBackground}, 0.04);
$light-bg-alpha-12:   rgba(${theme.palette.lightBackground}, 0.12);

// Background palette for dark themes.
$mat-dark-theme-background: (
  background:               $dark-background,
  status-bar:               $dark-bg-lighter-20,
  app-bar:                  $dark-bg-lighter-5,
  hover:                    $light-bg-alpha-4,
  card:                     $dark-bg-lighter-5,
  dialog:                   $dark-bg-lighter-5,
  disabled-button:          $light-bg-alpha-12,
  raised-button:            $dark-bg-lighter-5,
  focused-button:           $light-focused,
  selected-button:          $dark-bg-lighter-20,
  selected-disabled-button: $dark-bg-lighter-30,
  disabled-button-toggle:   $dark-bg-lighter-10,
  unselected-chip:          $dark-bg-lighter-20,
  disabled-list-option:     $dark-bg-lighter-10,
);

// Compute font config
@include mat-core($fontConfig);

// Theme Config
${['primary', 'accent', 'warn'].map(x => this.getScssPalette(x, theme.palette[x])).join('\n')};

$theme: ${!theme.lightness ? 'mat-dark-theme' : 'mat-light-theme'}($theme-primary, $theme-accent, $theme-warn);
$altTheme: ${!theme.lightness ? 'mat-light-theme' : 'mat-dark-theme'}($theme-primary, $theme-accent, $theme-warn);

// Theme Init
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
