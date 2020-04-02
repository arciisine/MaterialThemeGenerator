import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { filter, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { IconNotifyComponent } from './icon-notify/icon-notify.component';
import { ThemeService } from '../theme.service';

export type IconSelection = 'Filled' | 'Outlined' | 'Rounded' | 'TwoTone' | 'Sharp';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss']
})
export class IconPickerComponent implements OnInit {

  iconSet = new FormControl('Filled');
  opts = ['Filled', 'Outlined', 'Rounded', 'TwoTone', 'Sharp'];

  notified = false;

  constructor(private dialog: MatDialog, private service: ThemeService) { }

  ngOnInit() {
    this.iconSet.valueChanges
      .pipe(
        tap(x => this.service.icons = x),
        filter(x => x !== 'Filled' && !this.notified)
      )
      .subscribe();

    this.service.$icons.subscribe(x => {
      this.iconSet.setValue(x);
      this.iconSet.updateValueAndValidity();
    });
  }

  showNotice() {
    this.notified = true;
    this.dialog.open(IconNotifyComponent, { width: '500px', })
      .afterClosed()
      .subscribe();
  }
}
