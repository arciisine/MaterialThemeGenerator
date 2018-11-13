import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FontService } from './font.service';

@Component({
  selector: 'app-google-font-selector',
  templateUrl: './google-font-selector.component.html',
  styleUrls: ['./google-font-selector.component.scss']
})
export class GoogleFontSelectorComponent implements OnInit {

  key = 'AIzaSyCkI5cv-DtPe2YeRTW1WqFNtF_Dko-YHH8';

  @Input()
  control: FormControl;

  constructor(private fonts: FontService) { }

  ngOnInit() {

  }

  selectFont() {

  }
}
