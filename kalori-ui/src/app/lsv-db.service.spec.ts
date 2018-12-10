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
    let result = service.search('apelsin', 2)
    expect(result.length).toBe(2, result)
    expect(result[0].name).toBe('Apelsin')
    expect(result[0].kcal).toBe('49')
  })
});
