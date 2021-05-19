import { Injectable } from '@angular/core';
import { Palette } from './palette-picker/palette-picker.component';
import { IconSelection } from './icon-picker/icon-picker.component';
import { Subject, ReplaySubject } from 'rxjs';
import { FontSelection, DEFAULT_FONTS } from './font-picker/types';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Theme } from './render.service';


declare var Sass;

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  _palette: Palette;
  _fonts: FontSelection[];
  _icons: IconSelection = 'Filled';
  _lightness = true;
  _version = 11;

  $theme = new ReplaySubject<Theme>();

  $palette = new Subject<Partial<Palette>>();
  $fonts = new Subject<FontSelection[]>();
  $icons = new Subject<string>();
  $lightness = new Subject<boolean>();
  $version = new Subject<number>();
  $themeScss: Promise<void>;

  constructor(private http: HttpClient) {
    this.$themeScss = this.loadThemingScss();
  }

  loadThemingScss() {
    return this.http.get('https://unpkg.com/@angular/material@11.2.12/_theming.scss', { responseType: 'text' })
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
    this.$theme.next(this.theme);
  }

  get theme() {
    return {
      palette: this._palette,
      fonts: this._fonts,
      icons: this._icons,
      lightness: this._lightness,
      version: this._version
    };
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

  set version(version: number) {
    this._version = version;
    this.emit();
  }

  get version() {
    return this._version;
  }

  get withUse() {
    return this._version >= 12;
  }


  async compileScssTheme(src: string) {
    await this.$themeScss;
    return new Promise<string>((res, rej) =>
      Sass.compile(`@import 'https://unpkg.com/browse/@angular/material@11.2.12/core/theming/_theming.scss'; 
${src.replace('@include angular-material-theme($altTheme);', '')}`, v => {
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
