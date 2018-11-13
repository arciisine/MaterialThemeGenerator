import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  key = 'AIzaSyCkI5cv-DtPe2YeRTW1WqFNtF_Dko-YHH8';

  _fonts: FontMeta[] = [];

  loaded = false;

  private loading = {};

  constructor(private http: HttpClient) {
    this.getAllFonts().subscribe(x => {
      this._fonts = x.items;
    });
  }

  getFonts(filter?: string, serif = false) {
    const out = (this._fonts || [])
      .filter(x => filter ? x.family.toLowerCase().startsWith(filter.toLowerCase()) : true)
      .filter(x => x.category === (serif ? 'serif' : 'sans-serif'))
      .filter(x => x.variants.includes('regular') && x.variants.includes('500'));

    if (!this.loaded) {
      for (const item of out) {
        this.loadFont(item.family);
      }
    }
    return out;
  }

  public getAllFonts(sort: string = 'popularity') {
    return this.http.get<{ items: FontMeta[] }>(`https://www.googleapis.com/webfonts/v1/webfonts`, { params: { sort, key: this.key } });
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
      link.href = `https://fonts.googleapis.com/css?family=${family}:300,400,500`;
      link.rel = 'stylesheet';

      document.head.appendChild(link);
    } catch (e) {
      console.log('Unable to load font:', family);
    }
  }
}
