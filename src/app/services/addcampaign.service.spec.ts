import { TestBed, inject } from '@angular/core/testing';

import { AddcampaignService } from './addcampaign.service';

describe('AddcampaignService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddcampaignService]
    });
  });

  it('should be created', inject([AddcampaignService], (service: AddcampaignService) => {
    expect(service).toBeTruthy();
  }));
});
