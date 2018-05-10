import { TestBed, inject } from '@angular/core/testing';

import { StorageBucketService } from './storage-bucket.service';

describe('StorageBucketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageBucketService]
    });
  });

  it('should be created', inject([StorageBucketService], (service: StorageBucketService) => {
    expect(service).toBeTruthy();
  }));
});
