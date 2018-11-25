import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleFontItemComponent } from './google-font-item.component';

describe('GoogleFontItemComponent', () => {
  let component: GoogleFontItemComponent;
  let fixture: ComponentFixture<GoogleFontItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleFontItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleFontItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
