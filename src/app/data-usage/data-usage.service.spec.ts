import { TestBed } from '@angular/core/testing';

import { DataUsageService } from './data-usage.service';

describe('DataUsageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataUsageService = TestBed.get(DataUsageService);
    expect(service).toBeTruthy();
  });
});
