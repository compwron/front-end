import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycampeditComponent } from './mycampedit.component';

describe('MycampeditComponent', () => {
  let component: MycampeditComponent;
  let fixture: ComponentFixture<MycampeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycampeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycampeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
