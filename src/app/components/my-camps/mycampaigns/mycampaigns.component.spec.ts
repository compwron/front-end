import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MycampaignsComponent } from './mycampaigns.component';

describe('MycampaignsComponent', () => {
  let component: MycampaignsComponent;
  let fixture: ComponentFixture<MycampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MycampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
