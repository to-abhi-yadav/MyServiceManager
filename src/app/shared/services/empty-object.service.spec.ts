import { TestBed } from '@angular/core/testing';

import { EmptyObjectService } from './empty-object.service';

describe('EmptyObjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmptyObjectService = TestBed.get(EmptyObjectService);
    expect(service).toBeTruthy();
  });
});
