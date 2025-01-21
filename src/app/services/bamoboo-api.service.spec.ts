import { TestBed } from '@angular/core/testing';

import { BamobooApiService } from './bamoboo-api.service';

describe('BamobooApiService', () => {
  let service: BamobooApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BamobooApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
