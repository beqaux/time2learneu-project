import { describe, it, expect } from 'vitest';
import { fuzzyMatch, normalizeTurkish, levenshteinDistance } from '../lib/fuzzy-match';

describe('normalizeTurkish', () => {
  it('Türkçe karakterleri normalleştirir', () => {
    expect(normalizeTurkish('çğışüö')).toBe('cgisuo');
  });

  it('Büyük Türkçe harfleri de normalleştirir', () => {
    expect(normalizeTurkish('ÇĞİŞÜÖ')).toBe('cgisuo');
  });

  it('Boşluk ve özel karakterleri kaldırır', () => {
    expect(normalizeTurkish('hello world!')).toBe('helloworld');
  });
});

describe('levenshteinDistance', () => {
  it('Aynı string için 0 döner', () => {
    expect(levenshteinDistance('abc', 'abc')).toBe(0);
  });

  it('Tek karakter farkı için 1 döner', () => {
    expect(levenshteinDistance('abc', 'axc')).toBe(1);
  });

  it('Boş string ile tam uzunluk döner', () => {
    expect(levenshteinDistance('abc', '')).toBe(3);
    expect(levenshteinDistance('', 'xyz')).toBe(3);
  });
});

describe('fuzzyMatch', () => {
  it('Tam eşleşme', () => {
    expect(fuzzyMatch('Roma Antlaşması', 'Roma Antlaşması')).toBe(true);
  });

  it('Büyük/küçük harf farkını görmezden gelir', () => {
    expect(fuzzyMatch('maastricht', 'Maastricht')).toBe(true);
  });

  it('Türkçe karakter farkını görmezden gelir', () => {
    expect(fuzzyMatch('schengen anlasması', 'schengen anlaşması')).toBe(true);
  });

  it('%80+ benzerlik için true döner', () => {
    expect(fuzzyMatch('Bruksel', 'Brüksel')).toBe(true);
  });

  it('%80 altı benzerlik için false döner', () => {
    expect(fuzzyMatch('xyz', 'Roma Antlaşması')).toBe(false);
  });

  it('Boş string için false döner', () => {
    expect(fuzzyMatch('', 'Roma')).toBe(false);
    expect(fuzzyMatch('Roma', '')).toBe(false);
  });
});
