export default {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
