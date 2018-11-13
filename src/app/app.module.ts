import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PalettePickerComponent } from './palette-picker/palette-picker.component';
import { FontPickerComponent } from './font-picker/font-picker.component';
import { IconPickerComponent } from './icon-picker/icon-picker.component';
import { ThemeBuilderComponent } from './theme-builder/theme-builder.component';
import { ThemePreviewComponent } from './theme-preview/theme-preview.component';
import { HttpClientModule } from '@angular/common/http';
import { GoogleFontSelectorComponent } from './google-font-selector/google-font-selector.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    PalettePickerComponent,
    FontPickerComponent,
    IconPickerComponent,
    ThemeBuilderComponent,
    ThemePreviewComponent,
    GoogleFontSelectorComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ColorPickerModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
