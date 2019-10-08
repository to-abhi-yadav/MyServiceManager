import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoNotDisturbComponent } from './do-not-disturb.component';

describe('DoNotDisturbComponent', () => {
  let component: DoNotDisturbComponent;
  let fixture: ComponentFixture<DoNotDisturbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoNotDisturbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoNotDisturbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
