// Search starts filtering once the user has typed this many characters.
export const MIN_SEARCH_LENGTH = 3;

const words = (value: string) => value.toLowerCase().trim().split(/\s+/).filter(Boolean);

/**
 * True when every typed word is the start of some word in `text`, ignoring case:
 * "lag" matches "Lagos University…", "eko hos" matches "Eko Hospital".
 */
export function matchesWordPrefixes(text: string, query: string): boolean {
  const textWords = words(text);
  return words(query).every((part) => textWords.some((word) => word.startsWith(part)));
}

/** True when the query is long enough to filter by. */
export const isSearchActive = (query: string) => query.trim().length >= MIN_SEARCH_LENGTH;
