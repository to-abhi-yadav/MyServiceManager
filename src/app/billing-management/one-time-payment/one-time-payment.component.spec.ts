import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTimePaymentComponent } from './one-time-payment.component';

describe('OneTimePaymentComponent', () => {
  let component: OneTimePaymentComponent;
  let fixture: ComponentFixture<OneTimePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneTimePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneTimePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
