import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FontService } from './font.service';
import { FontMeta } from '../font-picker/types';
import { FontSelection } from '../font-picker/font-picker.component';

@Component({
  selector: 'app-google-font-selector',
  templateUrl: './google-font-selector.component.html',
  styleUrls: ['./google-font-selector.component.scss']
})
export class GoogleFontSelectorComponent implements OnInit {

  key = 'AIzaSyCkI5cv-DtPe2YeRTW1WqFNtF_Dko-YHH8';

  @Input()
  form: FormGroup;

  @Input()
  mode = 'form';

  @Input()
  label?: string;

  @Input()
  showSelect = false;

  filter = '';

  serif = false;

  sample = 'The quick brown fox jumps over the lazy dog';

  search = new FormControl();

  constructor(private fontService: FontService) { }

  ngOnInit() {
    this.form.get('family').valueChanges.subscribe(v => {
      this.fontService.loadFont(v);
    });
    if (this.form.value.family) {
      this.fontService.loadFont(this.form.value.family);
    }
  }

  getFonts(serif: boolean) {
    return this.fontService.getFonts(this.filter, serif);
  }

  closeFont() {
    this.showSelect = false;
  }

  selectFont() {
    this.showSelect = true;
  }

  pickFont(f: FontMeta) {
    this.showSelect = false;
    this.form.patchValue({
      family: f.family
    });
  }
}
