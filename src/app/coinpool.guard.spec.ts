import { TestBed } from '@angular/core/testing';

import { CoinpoolGuard } from './coinpool.guard';

describe('CoinpoolGuard', () => {
  let guard: CoinpoolGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CoinpoolGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
