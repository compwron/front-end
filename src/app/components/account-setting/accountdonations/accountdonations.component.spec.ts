import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountdonationsComponent } from './accountdonations.component';

describe('AccountdonationsComponent', () => {
  let component: AccountdonationsComponent;
  let fixture: ComponentFixture<AccountdonationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountdonationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountdonationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
