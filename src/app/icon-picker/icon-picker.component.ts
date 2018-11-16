import { Component, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { IconNotifyComponent } from './icon-notify/icon-notify.component';

export type IconSelection = 'Filled' | 'Outlined' | 'Rounded' | 'TwoTone' | 'Sharp';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss']
})
export class IconPickerComponent implements OnInit {

  iconSet = new FormControl('Filled');
  opts = ['Filled', 'Outlined', 'Rounded', 'TwoTone', 'Sharp'];

  @Output()
  updated = this.iconSet.valueChanges;

  notified = false;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.updated
      .pipe(
        filter(x => !this.notified)
      )
      .subscribe(x => this.showNotice());
  }

  showNotice() {
    this.dialog.open(IconNotifyComponent, {
      width: '500px',
    })
      .afterClosed()
      .subscribe(() => this.notified = true);
  }
}
