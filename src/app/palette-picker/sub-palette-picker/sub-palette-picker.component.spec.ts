import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPalettePickerComponent } from './sub-palette-picker.component';

describe('SubPalettePickerComponent', () => {
  let component: SubPalettePickerComponent;
  let fixture: ComponentFixture<SubPalettePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubPalettePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubPalettePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
