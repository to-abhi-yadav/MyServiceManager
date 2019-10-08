import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedDialingComponent } from './speed-dialing.component';

describe('SpeedDialingComponent', () => {
  let component: SpeedDialingComponent;
  let fixture: ComponentFixture<SpeedDialingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedDialingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedDialingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
