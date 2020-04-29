import { TestBed } from '@angular/core/testing';

import { PartyFormService } from './party-form.service';

describe('PartyFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartyFormService = TestBed.get(PartyFormService);
    expect(service).toBeTruthy();
  });
});
