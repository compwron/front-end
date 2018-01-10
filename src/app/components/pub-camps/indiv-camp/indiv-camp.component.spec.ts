import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndivCampComponent } from './indiv-camp.component';

describe('IndivCampComponent', () => {
  let component: IndivCampComponent;
  let fixture: ComponentFixture<IndivCampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndivCampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndivCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
