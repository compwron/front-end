import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountnotificationComponent } from './accountnotification.component';

describe('AccountnotificationComponent', () => {
  let component: AccountnotificationComponent;
  let fixture: ComponentFixture<AccountnotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountnotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
