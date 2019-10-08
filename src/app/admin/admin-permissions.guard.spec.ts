import { TestBed, async, inject } from '@angular/core/testing';

import { AdminPermissionsGuard } from './admin-permissions.guard';

describe('AdminPermissionsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminPermissionsGuard]
    });
  });

  it('should ...', inject([AdminPermissionsGuard], (guard: AdminPermissionsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
