import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewControlsComponent } from './preview-controls.component';

describe('PreviewControlsComponent', () => {
  let component: PreviewControlsComponent;
  let fixture: ComponentFixture<PreviewControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
