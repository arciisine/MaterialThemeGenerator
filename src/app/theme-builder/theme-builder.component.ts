import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { debounceTime, take, switchMap } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreditsComponent } from '../credits/credits.component';
import { ThemeService } from '../theme.service';

import { highlight } from './highlight';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RenderService, Theme } from '../render.service';


@Component({
  selector: 'app-theme-builder',
  templateUrl: './theme-builder.component.html',
  styleUrls: ['./theme-builder.component.scss']
})
export class ThemeBuilderComponent implements OnInit {

  form: FormGroup;

  refresh: Subject<number> = new Subject();
  ready: Subject<boolean> = new Subject();
  showSource = new FormControl(false);
  showingSource = false;
  isReady: boolean;
  source = '';
  css = '';
  sourcePretty: SafeHtml = '';
  first = true;
  version = new FormControl(11);

  constructor(private el: ElementRef, private zone: NgZone,
    private snackbar: MatSnackBar, private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    public service: ThemeService
  ) {
    if (window.location.search) {
      setTimeout(() => {
        const theme = atob(decodeURIComponent(window.location.search.replace(/^[?]c=/, '')));
        this.service.fromExternal(theme);
      }, 100);
    }
  }

  onReady() {
    this.ready.next(true);
  }

  showCredits() {
    this.dialog.open(CreditsComponent, {
      width: '500px',
    });
  }

  copy(title: string, val: string) {
    const el = document.createElement('textarea');
    el.value = val;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.snackbar.open(`Successfully copied ${title} to clipboard!`, 'dismiss', {
      duration: 3000
    });
  }

  exportCSS() {
    this.copy('css', this.css);
  }

  exportSCSS() {
    this.copy('Angular scss', this.source);
  }

  makeLink() {
    let link = window.location.toString().replace(/[#?].*$/g, '');
    link = `${link}?c=${btoa(this.service.toExternal())}`;
    this.copy('link', link);
  }

  ngOnInit() {
    this.ready
      .pipe(
        take(1),
        switchMap(x => this.service.$theme),
        debounceTime(100)
      )
      .subscribe(x => {
        this.updateTheme(x);
        setTimeout(() => this.isReady = true, 1000);
      });

    this.version.valueChanges
      .subscribe(x => this.service.version = x);

    this.service.$version.subscribe(x => {
      this.version.setValue(x);
      this.version.updateValueAndValidity();
    });

    this.version.updateValueAndValidity();

    this.showSource.valueChanges.subscribe(v => {
      this.showingSource = v;
    });

    window.addEventListener('message', (ev) => {
      if (ev.data && ev.data.iconsDone) {
        console.log('Got It!', ev);
      }
    });
  }

  updateTheme(theme: Theme) {

    if (!theme.palette || !theme.fonts) {
      return;
    }

    this.source = RenderService.getTemplate(theme);

    const iframe = (this.el.nativeElement as HTMLElement).querySelector('iframe');
    const body = iframe.contentDocument.body;

    this.sourcePretty = this.sanitizer.bypassSecurityTrustHtml(highlight(this.source));

    this.zone.runOutsideAngular(() => {
      this.service.compileScssTheme(RenderService.getTemplate({ ...theme, version: 11 })).then(text => {
        this.css = text;
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
