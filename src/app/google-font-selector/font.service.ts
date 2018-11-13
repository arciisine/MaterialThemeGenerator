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

  fonts: FontMeta[] = [];

  constructor(private http: HttpClient) {
    this.getAllFonts().subscribe(x => this.fonts = x.items);
  }

  public getAllFonts(sort: string = 'popularity') {
    return this.http.get<{ items: FontMeta[] }>(`https://www.googleapis.com/webfonts/v1/webfonts`, { params: { sort, key: this.key } });
  }
}
