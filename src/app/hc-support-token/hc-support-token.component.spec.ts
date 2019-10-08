import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HcSupportTokenComponent } from './hc-support-token.component';

describe('HcSupportTokenComponent', () => {
  let component: HcSupportTokenComponent;
  let fixture: ComponentFixture<HcSupportTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HcSupportTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HcSupportTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
