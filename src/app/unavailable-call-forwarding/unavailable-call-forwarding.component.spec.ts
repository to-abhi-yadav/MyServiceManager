import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnavailableCallForwardingComponent } from './unavailable-call-forwarding.component';

describe('UnavailableCallForwardingComponent', () => {
  let component: UnavailableCallForwardingComponent;
  let fixture: ComponentFixture<UnavailableCallForwardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnavailableCallForwardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnavailableCallForwardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
