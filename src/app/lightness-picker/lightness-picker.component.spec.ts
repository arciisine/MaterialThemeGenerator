import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightnessPickerComponent } from './lightness-picker.component';

describe('LightnessPickerComponent', () => {
  let component: LightnessPickerComponent;
  let fixture: ComponentFixture<LightnessPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LightnessPickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightnessPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
