import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MaterialPalette, ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-sub-palette-picker',
  templateUrl: './sub-palette-picker.component.html',
  styleUrls: ['./sub-palette-picker.component.scss']
})
export class SubPalettePickerComponent implements OnInit {

  material: MaterialPalette;

  @Input()
  form: FormGroup;

  backdrop: boolean;

  unlocked = false;

  materialKeys = [...Object.keys(ThemeService.MIX_AMOUNTS_PRIMARY), ...Object.keys(ThemeService.MIX_AMOUNTS_SECONDARY)];

  constructor(private service: ThemeService) {
  }

  get presets() {
    return !this.material ? undefined : this.materialKeys.map(x => this.material[x]);
  }

  ngOnInit() {
    this.form.get('main').valueChanges.subscribe(x => {
      if (x) {
        this.onMainChange(x);
      }
    });

    if (this.form.value.main) {
      this.onMainChange(this.form.value.main);
    }
  }

  onMainChange(c: string) {
    this.material = this.service.getPalette(c);

    if (!this.unlocked) {
      this.form.patchValue({ lighter: this.material['100'] });
      this.form.patchValue({ darker: this.material['800'] });
    }
  }

  getTextColor(col: string) {
    return this.service.getTextColor(col).startsWith('light') ? '#fff' : '#000';
  }

  setBackdrop(on: boolean) {
    this.backdrop = on;
  }
}
