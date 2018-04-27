import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WepayPaymentSuccessfulComponent } from './wepay-payment-successful.component';

describe('WepayPaymentSuccessfulComponent', () => {
  let component: WepayPaymentSuccessfulComponent;
  let fixture: ComponentFixture<WepayPaymentSuccessfulComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WepayPaymentSuccessfulComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WepayPaymentSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
