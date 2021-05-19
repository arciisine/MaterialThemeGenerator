import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-version-picker',
  templateUrl: './version-picker.component.html',
  styleUrls: ['./version-picker.component.scss']
})
export class VersionPickerComponent implements OnInit {

  version = new FormControl(false);

  constructor(private service: ThemeService) { }

  ngOnInit() {
    this.version.valueChanges
      .subscribe(x => this.service.version = x === true ? 12 : 11);

    this.service.$version.subscribe(x => {
      this.version.setValue(x === 12);
      this.version.updateValueAndValidity();
    });

    this.version.updateValueAndValidity();
  }

}
