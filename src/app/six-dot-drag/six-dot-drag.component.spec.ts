import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SixDotDragComponent } from './six-dot-drag.component';

describe('SixDotDragComponent', () => {
  let component: SixDotDragComponent;
  let fixture: ComponentFixture<SixDotDragComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SixDotDragComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SixDotDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
