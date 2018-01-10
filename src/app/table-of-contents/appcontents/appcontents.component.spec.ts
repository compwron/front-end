import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppcontentsComponent } from './appcontents.component';

describe('AppcontentsComponent', () => {
  let component: AppcontentsComponent;
  let fixture: ComponentFixture<AppcontentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppcontentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppcontentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
