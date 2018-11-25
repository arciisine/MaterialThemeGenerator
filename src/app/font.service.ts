import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

export interface FontMeta {
  kind: string;
  family: string;
  category: string;

  files: any[];
  variants: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FontService {

  key = '';

  _fonts: FontMeta[] = [];

  loaded = false;

  private loading = {};

  constructor(private http: HttpClient) {
    this.getAllFonts().subscribe(x => {
      this._fonts = x.items;
    });
  }

  getFonts(category: string, filter?: string) {
    const out = (this._fonts || [])
      .filter(x => filter ? x.family.toLowerCase().startsWith(filter.toLowerCase()) : true)
      .filter(x => x.category === category);

    return out;
  }

  public getAllFonts() {
    return this.http.get<{ items: FontMeta[] }>(`/assets/font-data.json`, {})
      .pipe(
        catchError(() => {
          return this.http.get<{ items: FontMeta[] }>(`https://www.googleapis.com/webfonts/v1/webfonts`,
            { params: { key: this.key } });
        })
      );
  }

  public loadFont(family: string) {
    if (family && !this.loading[family]) {
      this.loading[family] = true;
    } else {
      return;
    }
    try {
      const link = document.createElement('link');
      link.onerror = x => console.log('Unable to load font:', family);
      link.href = `https://fonts.googleapis.com/css?family=${family.replace(/ /g, '+')}:400`;
      link.rel = 'stylesheet';

      document.head.appendChild(link);
    } catch (e) {
      console.log('Unable to load font:', family);
    }
  }
}
