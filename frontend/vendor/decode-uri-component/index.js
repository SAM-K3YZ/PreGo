'use strict';

// Replaces decode-uri-component@0.2.2, whose fallback for malformed input can be
// made exponentially slow (a crafted deep link could hang the app). The patched
// upstream release is ESM-only and can't be require()d by query-string@7.
// Same contract: decode, and on malformed input decode only the valid %XX runs.
const PERCENT_RUN = /(?:%[0-9a-f]{2})+/gi;

function decodeRun(run) {
  try {
    return decodeURIComponent(run);
  } catch {
    return run;
  }
}

module.exports = function decodeComponent(encodedURI) {
  if (typeof encodedURI !== 'string') {
    throw new TypeError(`Expected \`encodedURI\` to be of type \`string\`, got \`${typeof encodedURI}\``);
  }
  try {
    return decodeURIComponent(encodedURI);
  } catch {
    return encodedURI.replace(PERCENT_RUN, decodeRun);
  }
};
