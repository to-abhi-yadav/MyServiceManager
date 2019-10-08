import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutopayFormComponent } from './autopay-form.component';

describe('AutopayFormComponent', () => {
  let component: AutopayFormComponent;
  let fixture: ComponentFixture<AutopayFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutopayFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutopayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
