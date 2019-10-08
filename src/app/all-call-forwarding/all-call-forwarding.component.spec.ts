import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCallForwardingComponent } from './all-call-forwarding.component';

describe('AllCallForwardingComponent', () => {
  let component: AllCallForwardingComponent;
  let fixture: ComponentFixture<AllCallForwardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCallForwardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCallForwardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
