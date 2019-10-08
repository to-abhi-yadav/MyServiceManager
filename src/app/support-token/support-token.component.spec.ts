import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTokenComponent } from './support-token.component';

describe('SupportTokenComponent', () => {
  let component: SupportTokenComponent;
  let fixture: ComponentFixture<SupportTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
