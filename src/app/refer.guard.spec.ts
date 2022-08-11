import { TestBed } from '@angular/core/testing';

import { ReferGuard } from './refer.guard';

describe('ReferGuard', () => {
  let guard: ReferGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ReferGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
