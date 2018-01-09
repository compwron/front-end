import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyindivcampComponent } from './myindivcamp.component';

describe('MyindivcampComponent', () => {
  let component: MyindivcampComponent;
  let fixture: ComponentFixture<MyindivcampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyindivcampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyindivcampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
