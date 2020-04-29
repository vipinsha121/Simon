import { TestBed } from '@angular/core/testing';

import { AmqpService } from './amqp.service';

describe('AmqpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmqpService = TestBed.get(AmqpService);
    expect(service).toBeTruthy();
  });
});
