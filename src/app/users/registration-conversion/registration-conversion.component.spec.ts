import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationConversionComponent } from './registration-conversion.component';

describe('RegistrationConversionComponent', () => {
  let component: RegistrationConversionComponent;
  let fixture: ComponentFixture<RegistrationConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
