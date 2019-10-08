import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalminutesComponent } from './internationalminutes.component';

describe('InternationalminutesComponent', () => {
  let component: InternationalminutesComponent;
  let fixture: ComponentFixture<InternationalminutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternationalminutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternationalminutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
