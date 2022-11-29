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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatLineModule, MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LightnessPickerComponent } from './lightness-picker/lightness-picker.component';
import { PreviewControlsComponent } from './theme-preview/preview-controls/preview-controls.component';
import { PreviewTypographyComponent } from './theme-preview/preview-typography/preview-typography.component';
import { PreviewContainersComponent } from './theme-preview/preview-containers/preview-containers.component';
import { CreditsComponent } from './credits/credits.component';
import { IconNotifyComponent } from './icon-picker/icon-notify/icon-notify.component';
import { SubPalettePickerComponent } from './palette-picker/sub-palette-picker/sub-palette-picker.component';
import { ColorPickerComponent } from './palette-picker/color-picker/color-picker.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GoogleFontItemComponent } from './google-font-selector/google-font-item/google-font-item.component';
import { PreviewGeneralComponent } from './theme-preview/preview-general/preview-general.component';

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
    IconNotifyComponent,
    SubPalettePickerComponent,
    ColorPickerComponent,
    GoogleFontItemComponent,
    PreviewGeneralComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ColorPickerModule,
    AppRoutingModule,
    FormsModule,
    ScrollingModule,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
