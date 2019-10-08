import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallForwardingBusyComponent } from './call-forwarding-busy.component';

describe('CallForwardingBusyComponent', () => {
  let component: CallForwardingBusyComponent;
  let fixture: ComponentFixture<CallForwardingBusyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallForwardingBusyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallForwardingBusyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
