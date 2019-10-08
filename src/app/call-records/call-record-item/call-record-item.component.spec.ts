import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRecordItemComponent } from './call-record-item.component';

describe('CallRecordItemComponent', () => {
  let component: CallRecordItemComponent;
  let fixture: ComponentFixture<CallRecordItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallRecordItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallRecordItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
