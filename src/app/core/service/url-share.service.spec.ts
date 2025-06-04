import { TestBed } from '@angular/core/testing';

import { UrlShareService } from './url-share.service';

describe('UrlShareService', () => {
  let service: UrlShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
