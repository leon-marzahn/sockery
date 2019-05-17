module.exports = {
  preset: 'ts-jest',
  roots: [
    '<rootDir>/src'
  ],
  testEnvironment: 'node',
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ],
  unmockedModulePathPatterns: [
    '/node_modules/'
  ],
  collectCoverageFrom: [
    '**/*.ts'
  ],
  collectCoverage: true,
  coverageReporters: [
    "lcov"
  ]
};