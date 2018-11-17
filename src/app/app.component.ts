import { Component, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MaterialThemeGenerator';

  constructor(
    private zone: NgZone,
    private matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer
  ) {
    let icons = 'Filled';
    this.matIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl(`/assets/material-icons-${icons}.svg`));

    this.matIconRegistry.addSvgIcon('github',
      domSanitizer.bypassSecurityTrustResourceUrl('/assets/github.svg'));

    if (window.parent !== window) {
      console.log('Watching icons');

      window.parent.addEventListener('message', (ev: MessageEvent) => {
        if (ev.data.icons) {
          this.zone.run(() => {
            const val = ev.data.icons;
            if (val !== icons) {
              console.log('Icons Changed', val);
              icons = val;
              this.matIconRegistry['_iconSetConfigs'].set('', null);
              this.matIconRegistry.addSvgIconSet(
                domSanitizer.bypassSecurityTrustResourceUrl(`/assets/material-icons-${icons}.svg`));
            }
            window.parent.postMessage('Done', window.location.toString());
          });
        }
      });
    }
  }
}
