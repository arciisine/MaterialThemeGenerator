import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContainersComponent } from './preview-containers.component';

describe('PreviewContainersComponent', () => {
  let component: PreviewContainersComponent;
  let fixture: ComponentFixture<PreviewContainersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewContainersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewContainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
