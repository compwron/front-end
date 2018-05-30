import { TestBed, async, inject } from '@angular/core/testing';

import { ConfirmedGuard } from './confirmed.guard';

describe('ConfirmedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmedGuard]
    });
  });

  it('should ...', inject([ConfirmedGuard], (guard: ConfirmedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
