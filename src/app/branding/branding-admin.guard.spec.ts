import { TestBed, async, inject } from '@angular/core/testing';

import { BrandingAdminGuard } from './branding-admin.guard';

describe('BrandingAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrandingAdminGuard]
    });
  });

  it('should ...', inject([BrandingAdminGuard], (guard: BrandingAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
