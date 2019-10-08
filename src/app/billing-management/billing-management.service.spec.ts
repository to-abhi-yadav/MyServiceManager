import { TestBed } from '@angular/core/testing';

import { BillingManagementService } from './billing-management.service';

describe('BillingManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillingManagementService = TestBed.get(BillingManagementService);
    expect(service).toBeTruthy();
  });
});
