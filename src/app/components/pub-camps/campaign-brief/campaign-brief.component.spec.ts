import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignBriefComponent } from './campaign-brief.component';

describe('CampaignBriefComponent', () => {
  let component: CampaignBriefComponent;
  let fixture: ComponentFixture<CampaignBriefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignBriefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
