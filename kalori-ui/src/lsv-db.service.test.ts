import React from 'react';
import { render, screen } from '@testing-library/react';
import LsvDbService from './lsv-db.service';

test('testservice should find apelsin', () => {
    const service: LsvDbService = new LsvDbService();
    let result = service.search('apelsin', 1)
    expect(result.entries.length).toBe(1)
    expect(result.totalEntries).toBe(16)
    expect(result.entries[0].name).toBe('Apelsin')
    expect(result.entries[0].kcal).toBe('49')
});
