---
to: packages/<%=name%>/package.json
---

{
  "name": "@cdk-utils/<%=name%>",
  "version": "0.1.0",
  "description": "",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist/"
  ],
  "scripts": {
    "build": "tsc --build",
    "clean": "tsc --build --clean",
    "test": "jest"
  },
  "engines": {
    "node": ">=14 <15"
  },
  "keywords": [],
  "author": "Simon",
  "license": "ISC",
  "devDependencies": {
    "@tsconfig/node14": "1.0.1",
    "@types/jest": "26.0.10",
    "jest": "26.4.2",
    "ts-jest": "26.2.0",
    "typescript": "4.4.4"
  }
}
