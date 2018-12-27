import { TestBed } from '@angular/core/testing';

import { LsvDbService } from './lsv-db.service';

describe('LsvDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LsvDbService = TestBed.get(LsvDbService);
    expect(service).toBeTruthy();
  });

  it('should find apelsin', () => {
    const service: LsvDbService = TestBed.get(LsvDbService)
    let result = service.search('apelsin', 1)
    expect(result.entries.length).toBe(1, result)
    expect(result.totalEntries).toBe(16, result)
    expect(result.entries[0].name).toBe('Apelsin')
    expect(result.entries[0].kcal).toBe('49')
  })
});
