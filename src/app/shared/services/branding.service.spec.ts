import { TestBed } from '@angular/core/testing';

import { BrandingService } from './branding.service';

describe('BrandingOptionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrandingService = TestBed.get(BrandingService);
    expect(service).toBeTruthy();
  });
});
