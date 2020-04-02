import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MaterialThemeGenerator';

  constructor(
    private matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon('github',
      domSanitizer.bypassSecurityTrustResourceUrl('/assets/github.svg'));
  }
}
