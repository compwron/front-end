import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycampaddComponent } from './mycampadd.component';

describe('MycampaddComponent', () => {
  let component: MycampaddComponent;
  let fixture: ComponentFixture<MycampaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycampaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycampaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
