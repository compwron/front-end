import { TestBed, inject } from '@angular/core/testing';

import { WepayService } from './wepay.service';

describe('WepayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WepayService]
    });
  });

  it('should be created', inject([WepayService], (service: WepayService) => {
    expect(service).toBeTruthy();
  }));
});
