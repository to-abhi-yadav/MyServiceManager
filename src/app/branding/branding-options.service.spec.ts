import { TestBed } from '@angular/core/testing';

import { BrandingOptionsService } from './branding-options.service';

describe('BrandingOptionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrandingOptionsService = TestBed.get(BrandingOptionsService);
    expect(service).toBeTruthy();
  });
});
