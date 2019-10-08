import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAttendantComponent } from './auto-attendant.component';

describe('AutoAttendantComponent', () => {
  let component: AutoAttendantComponent;
  let fixture: ComponentFixture<AutoAttendantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoAttendantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoAttendantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
