import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallForwardingNoAnswerComponent } from './call-forwarding-no-answer.component';

describe('CallForwardingNoAnswerComponent', () => {
  let component: CallForwardingNoAnswerComponent;
  let fixture: ComponentFixture<CallForwardingNoAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallForwardingNoAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallForwardingNoAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
