import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WepayRegisterComponent } from './wepay-register.component';

describe('WepayRegisterComponent', () => {
  let component: WepayRegisterComponent;
  let fixture: ComponentFixture<WepayRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WepayRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WepayRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
