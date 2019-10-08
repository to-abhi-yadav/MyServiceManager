import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularBusinessHoursComponent } from './regular-business-hours.component';

describe('RegularBusinessHoursComponent', () => {
  let component: RegularBusinessHoursComponent;
  let fixture: ComponentFixture<RegularBusinessHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularBusinessHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularBusinessHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
