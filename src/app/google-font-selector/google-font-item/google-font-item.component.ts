import { Component, OnInit, Input } from '@angular/core';
import { FontMeta } from 'src/app/font-picker/types';
import { FontService } from 'src/app/font.service';

@Component({
  selector: 'app-google-font-item',
  templateUrl: './google-font-item.component.html',
  styleUrls: ['./google-font-item.component.scss']
})
export class GoogleFontItemComponent implements OnInit {

  _f: FontMeta;

  @Input()
  sample: string;

  @Input()
  set f(f: FontMeta) {
    this._f = f;
    this.fontService.loadFont(f.family);
  }

  get f() {
    return this._f;
  }

  constructor(private fontService: FontService) { }

  ngOnInit() {

  }
}
