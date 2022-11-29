import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FontService } from '../font.service';
import { FontMeta } from '../font-picker/types';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-google-font-selector',
  templateUrl: './google-font-selector.component.html',
  styleUrls: ['./google-font-selector.component.scss']
})
export class GoogleFontSelectorComponent implements OnInit {

  filter = '';

  serif = false;

  tab = 'sans-serif';

  sample = 'The quick brown fox jumps over the lazy dog';

  search = new UntypedFormControl();

  constructor(private fontService: FontService, @Inject(MAT_DIALOG_DATA) public form: UntypedFormGroup, private ref: MatDialogRef<any, any>) { }

  ngOnInit() {
    if (this.form.value.family) {
      this.fontService.loadFont(this.form.value.family);
    }
  }

  getFonts(...categories: string[]) {
    return this.fontService.getFonts(categories, this.filter);
  }

  pickFont(f: FontMeta) {
    this.form.patchValue({
      family: f.family
    });
    this.form.updateValueAndValidity();
    this.ref.close();
  }
}
