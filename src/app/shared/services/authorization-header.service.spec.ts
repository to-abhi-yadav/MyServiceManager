import { TestBed } from '@angular/core/testing';

import { AuthorizationHeaderService } from './authorization-header.service';

describe('AuthorizationHeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthorizationHeaderService = TestBed.get(AuthorizationHeaderService);
    expect(service).toBeTruthy();
  });
});
