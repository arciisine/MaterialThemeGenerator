import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormArray, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ThemeService } from '../theme.service';
import { FontService, FontMeta } from '../font.service';
import { DEFAULT_FONTS, AllFontSelection, FontSelection } from './types';
import { MatDialog } from '@angular/material/dialog';
import { GoogleFontSelectorComponent } from '../google-font-selector/google-font-selector.component';
import { Observable } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';


@Component({
  selector: 'app-font-picker',
  templateUrl: './font-picker.component.html',
  styleUrls: ['./font-picker.component.scss']
})
export class FontPickerComponent implements OnInit {

  fonts: AllFontSelection = {};

  keys = Object.keys(DEFAULT_FONTS);

  variants = ['regular', 'medium', 'light'];

  items: UntypedFormArray;

  form: UntypedFormGroup = new UntypedFormGroup({
    family: new UntypedFormControl()
  });

  selectedIndex = -1;

  searchItems: Observable<FontMeta[]>;

  search = new UntypedFormControl();

  all: UntypedFormGroup;
  editing: UntypedFormGroup;

  constructor(fb: UntypedFormBuilder,
    private service: ThemeService,
    private dialog: MatDialog,
    private fontService: FontService
  ) {
    for (const k of Object.keys(DEFAULT_FONTS)) {
      this.fonts[k] = { ...DEFAULT_FONTS[k] };
    }

    this.all = new UntypedFormGroup({
      target: new UntypedFormControl(null),
      family: new UntypedFormControl(null),
      variant: new UntypedFormControl(null),
      lineHeight: new UntypedFormControl(null),
      size: new UntypedFormControl(null),
      spacing: new UntypedFormControl(null),
      capitalized: new UntypedFormControl(null),
    });

    this.all.valueChanges.subscribe((v) => {
      const keys = Object.keys(v).filter(k => v[k] !== null);
      for (const ctrl of this.items.controls) {
        for (const k of keys) {
          (ctrl as UntypedFormGroup).get(k).setValue(v[k]);
        }
      }
      this.form.updateValueAndValidity();
    });

    this.items = fb.array(this.keys.map(x =>
      fb.group({
        target: fb.control(this.fonts[x].target),
        family: new UntypedFormControl(this.fonts[x].family),
        variant: fb.control(this.fonts[x].variant),
        lineHeight: fb.control(this.fonts[x].lineHeight),
        size: fb.control(this.fonts[x].size),
        spacing: fb.control(this.fonts[x].spacing),
        capitalized: fb.control(this.fonts[x].capitalized),
      })
    ));

    this.searchItems = this.search.valueChanges
      .pipe(
        switchMap(x => this.searchAllFonts(x))
      );
  }

  searchAllFonts(q: string) {
    q = q.toLowerCase();
    return this.fontService.getAllFonts()
      .pipe(
        map(x =>
          x.items.filter(v => v.family.toLowerCase().startsWith(q)))
      );
  }

  ngOnInit() {
    this.items.valueChanges.subscribe(x => {
      this.service.fonts = x;
      this.fonts = (x as FontSelection[]).reduce((acc, v) => {
        acc[v.target] = v;
        return acc;
      }, {});

      if (this.selectedIndex >= 0) {
        if (this.search.value !== this.items.at(this.selectedIndex).value.family) {
          this.search.setValue(this.items.at(this.selectedIndex).value.family);
        }
      }
    });


    this.service.$fonts.subscribe(x => {
      const families = Array.from(new Set(x.map(f => f.family)));
      for (const f of families) {
        this.fontService.loadFont(f);
      }
      this.items.setValue(x.map(f => Object.assign({}, DEFAULT_FONTS[f.target], f)));
    });

    this.items.updateValueAndValidity();
  }

  edit(idx: number) {
    this.selectedIndex = idx;
    if (this.selectedIndex >= 0) {
      this.search.setValue(this.items.at(idx).value.family);
    }
    this.editing = this.items.at(idx) as UntypedFormGroup;
  }

  editAll() {
    this.search.setValue('');
    this.all.setValue({
      target: null,
      family: null,
      variant: null,
      lineHeight: null,
      size: null,
      spacing: null,
      capitalized: null
    });
    this.editing = this.all;
  }

  selectFont() {
    this.dialog.open(GoogleFontSelectorComponent, {
      data: this.editing
    });
  }

  pickFont(f: FontMeta) {
    this.editing.patchValue({ family: f.family });
    this.fontService.loadFont(f.family);
    this.form.updateValueAndValidity();
  }
}

