module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  ignorePatterns: ['node_modules/', 'ios/', 'android/', '.expo/', 'dist/'],
  rules: {
    // Enforce the @/ alias over deep relative imports.
    'no-restricted-imports': ['error', { patterns: ['../*'] }],
    // Flags `useRef(new Animated.Value(x)).current`, the standard RN Animated pattern.
    'react-hooks/refs': 'off',
  },
};
