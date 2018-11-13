import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleFontSelectorComponent } from './google-font-selector.component';

describe('GoogleFontSelectorComponent', () => {
  let component: GoogleFontSelectorComponent;
  let fixture: ComponentFixture<GoogleFontSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleFontSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleFontSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
