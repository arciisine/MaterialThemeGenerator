import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconNotifyComponent } from './icon-notify.component';

describe('IconNotifyComponent', () => {
  let component: IconNotifyComponent;
  let fixture: ComponentFixture<IconNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconNotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
