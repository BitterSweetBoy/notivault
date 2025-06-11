import { TestBed } from '@angular/core/testing';

import { IntegrationServiceService } from './integration-service.service';

describe('IntegrationServiceService', () => {
  let service: IntegrationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
