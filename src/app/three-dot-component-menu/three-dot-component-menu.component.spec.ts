import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDotComponentMenuComponent } from './three-dot-component-menu.component';

describe('ThreeDotComponentMenuComponent', () => {
  let component: ThreeDotComponentMenuComponent;
  let fixture: ComponentFixture<ThreeDotComponentMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeDotComponentMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeDotComponentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
