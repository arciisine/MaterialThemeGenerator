import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-theme-preview',
  templateUrl: './theme-preview.component.html',
  styleUrls: ['./theme-preview.component.scss']
})
export class ThemePreviewComponent implements OnInit {

  loadingIcons = false;

  constructor(private zone: NgZone) { }

  ngOnInit() {

    window.parent.addEventListener('message', (ev: MessageEvent) => {
      if (ev.data.icons) {
        this.zone.run(() => {
          this.loadingIcons = true;
          setTimeout(() => this.loadingIcons = false, 10);
        });
      }
    });
  }

}
