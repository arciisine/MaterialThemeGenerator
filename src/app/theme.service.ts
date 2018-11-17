import { Injectable } from '@angular/core';
import { AllPalette } from './palette-picker/palette-picker.component';
import { IconSelection } from './icon-picker/icon-picker.component';
import { Subject, ReplaySubject } from 'rxjs';
import { FontSelection, DEFAULT_FONTS } from './font-picker/types';
import { theme as themeScss } from './theme-builder/theming.scss';

declare var Sass;
Sass.writeFile('~@angular/material/theming', themeScss);

export interface Theme {
  palette: AllPalette;
  fonts: FontSelection[];
  icons: IconSelection;
  lightness: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  _palette: AllPalette;
  _fonts: FontSelection[];
  _icons: IconSelection = 'Filled';
  _lightness = true;

  theme = new ReplaySubject<Theme>();

  paletteSet = new Subject<{ [key: string]: string }>();
  fontsSet = new Subject<FontSelection[]>();
  iconsSet = new Subject<string>();
  lightnessSet = new Subject<boolean>();

  constructor() { }

  emit() {
    this.theme.next({
      palette: this._palette,
      fonts: this._fonts,
      icons: this._icons,
      lightness: this._lightness
    });
  }

  set palette(pal: AllPalette) {
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

  fontRule(x: FontSelection) {
    const weight = x.variant === 'light' ? '300' : (x.variant === 'medium' ? '500' : '400');

    return !!x.size ?
      `mat-typography-level(${x.size}px, ${x.lineHeight}px, ${weight}, '${x.family}', ${(x.spacing / x.size).toFixed(4)}em)` :
      `mat-typography-level(inherits, ${x.lineHeight}, ${weight}, '${x.family}', 1.5px)`;
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

$light-text: ${theme.palette.lightText[500].hex};
$light-primary-text: $light-text;
$light-accent-text: rgba($light-primary-text, 0.7);
$light-disabled-text: rgba($light-primary-text, 0.5);
$light-dividers: rgba($light-primary-text, 0.12);
$light-focused: rgba($light-primary-text, 0.12);

$dark-text: ${theme.palette.darkText[500].hex};
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
$mat-primary: (
  ${Object.values(theme.palette.primary).map(x => `${x.key}: ${x.hex}`).join(',\n  ')},
  contrast : (
    ${Object.values(theme.palette.primary).map(x => `${x.key}: $${x.isLight ? 'dark' : 'light'}-primary-text`).join(',\n    ')}
  )
);
$mat-accent: (
  ${Object.values(theme.palette.accent).map(x => `${x.key}: ${x.hex}`).join(',\n  ')},
  contrast : (
    ${Object.values(theme.palette.accent).map(x => `${x.key}: $${x.isLight ? 'dark' : 'light'}-primary-text`).join(',\n    ')}
  )
);
$mat-warn: (
  ${Object.values(theme.palette.warn).map(x => `${x.key}: ${x.hex}`).join(',\n  ')},
  contrast : (
    ${Object.values(theme.palette.warn).map(x => `${x.key}: $${x.isLight ? 'dark' : 'light'}-primary-text`).join(',\n    ')}
  )
);

$themePrimary: mat-palette($mat-primary);
$themeAccent: mat-palette($mat-accent);
$themeWarn: mat-palette($mat-warn);

// Create the theme object (a Sass map containing all of the palettes).
$theme: ${!theme.lightness ? 'mat-dark-theme' : 'mat-light-theme'}($themePrimary, $themeAccent, $themeWarn);
$altTheme: ${!theme.lightness ? 'mat-light-theme' : 'mat-dark-theme'}($themePrimary, $themeAccent, $themeWarn);

// Include theme styles for core and each component used in your app.
// Alternatively, you can import and @include the theme mixins for each component
// that you are using.
@include angular-material-theme($theme);

.theme-alternate {
  @include angular-material-theme($altTheme);
}
`;
    // tslint:enable:no-trailing-whitespace
    // tslint:enable:max-line-length
    return tpl;
  }

  compileScssTheme(src: string) {
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

      this.lightnessSet.next(json.lightness);
      this.iconsSet.next(json.icons);
      this.paletteSet.next(json.palette);
      this.fontsSet.next(json.fonts);
    } catch (e) {
      console.error('Unable to read', val, e);
    }
  }

  toExternal() {
    const data = {
      palette: {
        primary: this.palette.primary['500'].hex,
        accent: this.palette.accent['500'].hex,
        warn: this.palette.warn['500'].hex,
        lightText: this.palette.lightText['500'].hex,
        darkText: this.palette.darkText['500'].hex,
      },
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
