import { TestBed } from '@angular/core/testing';

import { CarpoolService } from './carpool.service';

describe('CarpoolService', () => {
  let service: CarpoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarpoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
