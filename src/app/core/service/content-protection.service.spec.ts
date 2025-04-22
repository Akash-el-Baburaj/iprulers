import { TestBed } from '@angular/core/testing';

import { ContentProtectionService } from './content-protection.service';

describe('ContentProtectionService', () => {
  let service: ContentProtectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentProtectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
