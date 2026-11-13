import decodeComponent from 'decode-uri-component';

// Guards the vendored replacement (see vendor/decode-uri-component).
describe('decode-uri-component override', () => {
  it('decodes valid input', () => {
    expect(decodeComponent('caf%C3%A9%20au%20lait')).toBe('café au lait');
  });

  it('decodes the valid parts of malformed input', () => {
    expect(decodeComponent('%E0%A4%A%20ok')).toBe('%E0%A4%A ok');
    expect(decodeComponent('100%')).toBe('100%');
  });

  it('stays fast on hostile input', () => {
    const hostile = '%C2'.repeat(50_000) + '%';
    const start = Date.now();
    decodeComponent(hostile);
    expect(Date.now() - start).toBeLessThan(500);
  });

  it('rejects non-strings', () => {
    expect(() => decodeComponent(undefined as unknown as string)).toThrow(TypeError);
  });
});
