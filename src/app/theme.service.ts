import { Injectable } from '@angular/core';
import { AllPalette } from './palette-picker/palette-picker.component';
import { FontSelection } from './font-picker/font-picker.component';
import { IconSelection } from './icon-picker/icon-picker.component';
import { Observable, Subject } from 'rxjs';

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

  theme = new Subject<Theme>();

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
}
