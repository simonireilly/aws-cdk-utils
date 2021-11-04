---
to: packages/<%=name%>/jest.config.js
---
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__test__'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
