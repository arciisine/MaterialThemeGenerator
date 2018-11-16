import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import * as hljs from 'highlight.js';
import scss from 'highlight.js/lib/languages/scss';

import { debounceTime, take, switchMap } from 'rxjs/operators';

import { FontSelection } from '../font-picker/font-picker.component';

import { theme as themeScss } from './theming.scss';
import { MatSnackBar, MatDialog } from '@angular/material';
import { CreditsComponent } from '../credits/credits.component';
import { ThemeService, Theme } from '../theme.service';

hljs.registerLanguage('scss', scss);
hljs.initHighlighting();

declare var Sass;

@Component({
  selector: 'app-theme-builder',
  templateUrl: './theme-builder.component.html',
  styleUrls: ['./theme-builder.component.scss']
})
export class ThemeBuilderComponent implements OnInit {

  form: FormGroup;

  refresh: Subject<number> = new Subject();
  ready: Subject<boolean> = new Subject();
  isReady: boolean;
  showingSource = false;
  source = '';
  sourcePretty = '';
  first = true;

  constructor(private el: ElementRef, private zone: NgZone,
    private snackbar: MatSnackBar, private dialog: MatDialog,
    private service: ThemeService
  ) {
  }

  onReady() {
    this.isReady = true;
    this.ready.next(true);
  }

  showSource(yes: boolean) {
    this.showingSource = yes;
  }

  showCredits() {
    this.dialog.open(CreditsComponent, {
      width: '500px',
    });
  }

  doExport() {
    const el = document.createElement('textarea');
    el.value = this.source;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.snackbar.open('Successfully copied to clipboard!', 'dismiss', {
      duration: 3000
    });
  }

  ngOnInit() {
    this.ready
      .pipe(
        take(1),
        switchMap(x => this.service.theme),
        debounceTime(100)
      )
      .subscribe(x => this.updateTheme(x));

    window.addEventListener('message', (ev) => {
      if (ev.data && ev.data.iconsDone) {
        console.log('Got It!', ev);
      }
    });
  }

  fontRule(x: FontSelection) {
    return `mat-typography-level(${(x.size ?
      [
        `${x.size}px`,
        `${x.lineHeight || x.size}${parseInt(`${x.lineHeight || x.size}`, 10) <= 5 ? '' : 'px'}`,
        `${x.variant === 'light' ? '300' : (x.variant === 'medium' ? '500' : '400')}`,
        `'${x.family}'`,
        `${x.size ? x.spacing / x.size : 0}em`,
      ] :
      [
        `inherits`,
        `${x.lineHeight || x.size}${parseInt(`${x.lineHeight || x.size}`, 10) <= 5 ? '' : 'px'}`,
        `${x.variant === 'light' ? '300' : (x.variant === 'medium' ? '500' : '400')}`,
        `'${x.family}'`,
      ]
    ).join(', ')})`;
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

@import url('https://fonts.googleapis.com/css?family=${Array.from(new Set((theme.fonts || []).map(x => x.family))).map(x => `${x}:300,400,500`).join(',')}');    

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

  updateTheme(theme: Theme) {

    console.log('Refreshing preview', theme.palette, theme.fonts);

    if (!theme.palette || !theme.fonts) {
      return;
    }

    this.source = this.getTemplate(theme);

    const iframe = (this.el.nativeElement as HTMLElement).querySelector('iframe');
    const body = iframe.contentDocument.body;

    this.sourcePretty = hljs.highlightAuto(this.source, ['scss']).value;

    this.zone.runOutsideAngular(() => {
      window.postMessage({ icons: theme.icons }, window.location.toString());

      if (this.first) {
        Sass.writeFile('~@angular/material/theming', themeScss);
        this.first = false;
      }

      Sass.compile(this.source.replace('@include angular-material-theme($altTheme);', ''), v => {
        if (body.childNodes && body.childNodes.item(0) &&
          (body.childNodes.item(0) as HTMLElement).tagName &&
          (body.childNodes.item(0) as HTMLElement).tagName.toLowerCase() === 'style') {
          body.removeChild(body.childNodes.item(0));
        }

        const style = iframe.contentDocument.createElement('style');
        style.type = 'text/css';
        style.textContent = v.text;
        body.insertBefore(style, body.childNodes.item(0));
      });
    });
  }
}
