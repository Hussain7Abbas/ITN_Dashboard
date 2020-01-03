import { TestBed } from '@angular/core/testing';

import { DatabaseProviderService } from './database-provider.service';

describe('DatabaseProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatabaseProviderService = TestBed.get(DatabaseProviderService);
    expect(service).toBeTruthy();
  });
});
