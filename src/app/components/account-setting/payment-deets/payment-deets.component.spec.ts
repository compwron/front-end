import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDeetsComponent } from './payment-deets.component';

describe('PaymentDeetsComponent', () => {
  let component: PaymentDeetsComponent;
  let fixture: ComponentFixture<PaymentDeetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDeetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDeetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
