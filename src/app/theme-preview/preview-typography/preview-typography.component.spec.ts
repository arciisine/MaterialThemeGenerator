import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewTypographyComponent } from './preview-typography.component';

describe('PreviewTypographyComponent', () => {
  let component: PreviewTypographyComponent;
  let fixture: ComponentFixture<PreviewTypographyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewTypographyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewTypographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
