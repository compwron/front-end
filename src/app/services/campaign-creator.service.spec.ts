import { TestBed, inject } from '@angular/core/testing';

import { CampaignCreatorService } from './campaign-creator.service';

describe('CampaignCreatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignCreatorService]
    });
  });

  it('should be created', inject([CampaignCreatorService], (service: CampaignCreatorService) => {
    expect(service).toBeTruthy();
  }));
});
