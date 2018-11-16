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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatMenuModule, MatCardModule, MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule,
  MatButtonModule, MatCheckboxModule, MatIconModule, MatLineModule, MatListModule, MatTabsModule,
  MatChipsModule, MatInputModule, MatRadioModule, MatDialogModule, MatSelectModule, MatSliderModule,
  MatSidenavModule, MatStepperModule, MatToolbarModule, MatTooltipModule, MatSnackBarModule, MatFormFieldModule,
  MatDatepickerModule, MatOptionModule, MatProgressBarModule, MatSlideToggleModule, MatProgressSpinnerModule,
  MatButtonToggleModule,
  MatNativeDateModule,
  MatTableModule,
  MatExpansionModule
} from '@angular/material';

import { LightnessPickerComponent } from './lightness-picker/lightness-picker.component';
import { PreviewControlsComponent } from './theme-preview/preview-controls/preview-controls.component';
import { PreviewTypographyComponent } from './theme-preview/preview-typography/preview-typography.component';
import { PreviewContainersComponent } from './theme-preview/preview-containers/preview-containers.component';
import { CreditsComponent } from './credits/credits.component';
import { IconNotifyComponent } from './icon-picker/icon-notify/icon-notify.component';

@NgModule({
  declarations: [
    AppComponent,
    PalettePickerComponent,
    FontPickerComponent,
    IconPickerComponent,
    ThemeBuilderComponent,
    ThemePreviewComponent,
    GoogleFontSelectorComponent,
    LightnessPickerComponent,
    PreviewControlsComponent,
    PreviewTypographyComponent,
    PreviewContainersComponent,
    CreditsComponent,
    IconNotifyComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ColorPickerModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatCardModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    MatLineModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    MatSliderModule,
    MatSidenavModule,
    MatStepperModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatOptionModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatExpansionModule
  ],
  entryComponents: [
    CreditsComponent,
    GoogleFontSelectorComponent,
    IconNotifyComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
