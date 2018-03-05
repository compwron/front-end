import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountbasicComponent } from './accountbasic.component';

describe('AccountbasicComponent', () => {
  let component: AccountbasicComponent;
  let fixture: ComponentFixture<AccountbasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountbasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountbasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
