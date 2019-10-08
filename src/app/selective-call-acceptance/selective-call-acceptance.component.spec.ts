import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectiveCallAcceptanceComponent } from './selective-call-acceptance.component';

describe('SelectiveCallAcceptanceComponent', () => {
  let component: SelectiveCallAcceptanceComponent;
  let fixture: ComponentFixture<SelectiveCallAcceptanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectiveCallAcceptanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectiveCallAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
