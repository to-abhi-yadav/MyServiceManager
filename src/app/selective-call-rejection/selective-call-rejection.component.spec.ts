import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectiveCallRejectionComponent } from './selective-call-rejection.component';

describe('SelectiveCallRejectionComponent', () => {
  let component: SelectiveCallRejectionComponent;
  let fixture: ComponentFixture<SelectiveCallRejectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectiveCallRejectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectiveCallRejectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
