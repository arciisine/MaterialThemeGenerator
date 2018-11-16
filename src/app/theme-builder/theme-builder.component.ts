import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import * as hljs from 'highlight.js';
import scss from 'highlight.js/lib/languages/scss';

import { debounceTime, take, switchMap, publishReplay, shareReplay } from 'rxjs/operators';

import { MatSnackBar, MatDialog } from '@angular/material';
import { CreditsComponent } from '../credits/credits.component';
import { ThemeService, Theme } from '../theme.service';

hljs.registerLanguage('scss', scss);
hljs.initHighlighting();


@Component({
  selector: 'app-theme-builder',
  templateUrl: './theme-builder.component.html',
  styleUrls: ['./theme-builder.component.scss']
})
export class ThemeBuilderComponent implements OnInit {

  form: FormGroup;

  refresh: Subject<number> = new Subject();
  ready: Subject<boolean> = new Subject();
  isReady: boolean;
  showingSource = false;
  source = '';
  sourcePretty = '';
  first = true;

  constructor(private el: ElementRef, private zone: NgZone,
    private snackbar: MatSnackBar, private dialog: MatDialog,
    public service: ThemeService
  ) {
    if (window.location.search) {
      setTimeout(() => {
        this.service.fromExternal(
          atob(decodeURIComponent(window.location.search.replace(/^[?]|[=]$/g, '')))
        );
      }, 100);
    }
  }

  onReady() {
    this.ready.next(true);
  }

  showSource(yes: boolean) {
    this.showingSource = yes;
  }

  showCredits() {
    this.dialog.open(CreditsComponent, {
      width: '500px',
    });
  }

  copy(val: string) {
    const el = document.createElement('textarea');
    el.value = val;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  doExport() {
    this.copy(this.source);
    this.snackbar.open('Successfully copied to clipboard!', 'dismiss', {
      duration: 3000
    });
  }

  makeLink() {
    let link = window.location.toString().replace(/[#?].*$/g, '');
    link = `${link}?${btoa(this.service.toExternal())}`;
    this.copy(link);
    this.snackbar.open('Successfully copied to clipboard!', 'dismiss', {
      duration: 3000
    });
  }

  ngOnInit() {
    this.ready
      .pipe(
        take(1),
        switchMap(x => this.service.theme),
        debounceTime(100)
      )
      .subscribe(x => {
        this.updateTheme(x);
        setTimeout(() => this.isReady = true, 1000);
      });

    window.addEventListener('message', (ev) => {
      if (ev.data && ev.data.iconsDone) {
        console.log('Got It!', ev);
      }
    });
  }

  updateTheme(theme: Theme) {

    console.log('Refreshing preview', theme.palette, theme.fonts);

    if (!theme.palette || !theme.fonts) {
      return;
    }

    this.source = this.service.getTemplate(theme);

    const iframe = (this.el.nativeElement as HTMLElement).querySelector('iframe');
    const body = iframe.contentDocument.body;

    this.sourcePretty = hljs.highlightAuto(this.source, ['scss']).value;

    this.zone.runOutsideAngular(() => {
      window.postMessage({ icons: theme.icons }, window.location.toString());
      this.service.compileScssTheme(this.source).then(text => {
        if (body.childNodes && body.childNodes.item(0) &&
          (body.childNodes.item(0) as HTMLElement).tagName &&
          (body.childNodes.item(0) as HTMLElement).tagName.toLowerCase() === 'style') {
          body.removeChild(body.childNodes.item(0));
        }

        const style = iframe.contentDocument.createElement('style');
        style.type = 'text/css';
        style.textContent = text;
        body.insertBefore(style, body.childNodes.item(0));
      }).catch(err => {
        console.error(err);
      });
    });
  }
}
