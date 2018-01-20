import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentWidgetComponent } from './payment-widget.component';

describe('PaymentWidgetComponent', () => {
  let component: PaymentWidgetComponent;
  let fixture: ComponentFixture<PaymentWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
