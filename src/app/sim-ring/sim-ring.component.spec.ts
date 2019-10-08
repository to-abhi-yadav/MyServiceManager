import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimRingComponent } from './sim-ring.component';

describe('SimRingComponent', () => {
  let component: SimRingComponent;
  let fixture: ComponentFixture<SimRingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimRingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimRingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
