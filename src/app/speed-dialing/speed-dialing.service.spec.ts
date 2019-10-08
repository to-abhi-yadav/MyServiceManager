import { TestBed } from '@angular/core/testing';

import { SpeedDialingService } from './speed-dialing.service';

describe('SpeedDialingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpeedDialingService = TestBed.get(SpeedDialingService);
    expect(service).toBeTruthy();
  });
});
