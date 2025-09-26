module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js'
  ],
  testMatch: ['**/tests/**/*.test.js']
};