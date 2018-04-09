import { TestBed, inject } from '@angular/core/testing';

import { CampaignOneService } from './campaign-one.service';

describe('CampaignOneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignOneService]
    });
  });

  it('should be created', inject([CampaignOneService], (service: CampaignOneService) => {
    expect(service).toBeTruthy();
  }));
});
