import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-theme-preview',
  templateUrl: './theme-preview.component.html',
  styleUrls: ['./theme-preview.component.scss']
})
export class ThemePreviewComponent {

  activeTab: string;

  constructor() { }

  handleTabChange(tab: MatTabChangeEvent) {
    this.activeTab = tab.tab.ariaLabel;
  }

}
