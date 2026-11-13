import { isSearchActive, matchesWordPrefixes } from '@/utils/search';

describe('matchesWordPrefixes', () => {
  const name = 'Lagos University Teaching Hospital';

  it('matches the start of any word, ignoring case', () => {
    expect(matchesWordPrefixes(name, 'lag')).toBe(true);
    expect(matchesWordPrefixes(name, 'TEACH')).toBe(true);
    expect(matchesWordPrefixes(name, 'hos')).toBe(true);
  });

  it('needs every typed word to match', () => {
    expect(matchesWordPrefixes('Eko Hospital', 'eko hos')).toBe(true);
    expect(matchesWordPrefixes('Eko Hospital', 'eko lag')).toBe(false);
  });

  it('does not match the middle of a word', () => {
    expect(matchesWordPrefixes(name, 'gos')).toBe(false);
  });
});

describe('isSearchActive', () => {
  it('starts filtering at three characters', () => {
    expect(isSearchActive('la')).toBe(false);
    expect(isSearchActive('  la ')).toBe(false);
    expect(isSearchActive('lag')).toBe(true);
  });
});
