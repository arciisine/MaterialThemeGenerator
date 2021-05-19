import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreviewTypographyComponent } from './preview-typography.component';

describe('PreviewTypographyComponent', () => {
  let component: PreviewTypographyComponent;
  let fixture: ComponentFixture<PreviewTypographyComponent>;

  beforeEach(waitForAsync(() => {
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
