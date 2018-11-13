import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconPickerComponent } from './icon-picker.component';

describe('IconPickerComponent', () => {
  let component: IconPickerComponent;
  let fixture: ComponentFixture<IconPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
