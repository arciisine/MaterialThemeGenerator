import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-lightness-picker',
  templateUrl: './lightness-picker.component.html',
  styleUrls: ['./lightness-picker.component.scss']
})
export class LightnessPickerComponent implements OnInit {

  lightness = new FormControl(true);

  constructor(private service: ThemeService) { }

  ngOnInit() {
    this.lightness.valueChanges
      .subscribe(x => this.service.lightness = x);
  }

}
