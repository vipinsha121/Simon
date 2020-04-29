import { TestBed } from '@angular/core/testing';

import { DealHeaderService } from './deal-header.service';

describe('DealHeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DealHeaderService = TestBed.get(DealHeaderService);
    expect(service).toBeTruthy();
  });
});
