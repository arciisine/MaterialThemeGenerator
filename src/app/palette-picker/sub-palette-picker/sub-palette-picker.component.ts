import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ThemeService } from 'src/app/theme.service';
import { filter } from 'rxjs/operators';
import { MaterialPalette, RenderService } from 'src/app/render.service';

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

  unlocked = new FormControl(false);

  materialKeys = [...Object.keys(RenderService.MIX_AMOUNTS_PRIMARY), ...Object.keys(RenderService.MIX_AMOUNTS_SECONDARY)];

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

    this.unlocked.valueChanges.pipe(
      filter(x => !x)
    ).subscribe(x => {
      this.onMainChange(this.form.value.main);
    });
  }

  onMainChange(c: string) {
    this.material = RenderService.getPalette(c);

    if (!this.unlocked.value) {
      this.form.patchValue({ lighter: this.material['100'] });
      this.form.patchValue({ darker: this.material['800'] });
    }
  }

  getTextColor(col: string) {
    return RenderService.getTextColor(col).startsWith('light') ? '#fff' : '#000';
  }

  setBackdrop(on: boolean) {
    this.backdrop = on;
  }
}
