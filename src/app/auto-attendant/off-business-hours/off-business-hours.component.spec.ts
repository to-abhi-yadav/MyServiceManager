import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffBusinessHoursComponent } from './off-business-hours.component';

describe('OffBusinessHoursComponent', () => {
  let component: OffBusinessHoursComponent;
  let fixture: ComponentFixture<OffBusinessHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffBusinessHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffBusinessHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
