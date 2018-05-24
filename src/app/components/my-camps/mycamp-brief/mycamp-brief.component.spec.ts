import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycampBriefComponent } from './mycamp-brief.component';

describe('MycampBriefComponent', () => {
  let component: MycampBriefComponent;
  let fixture: ComponentFixture<MycampBriefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycampBriefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycampBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
