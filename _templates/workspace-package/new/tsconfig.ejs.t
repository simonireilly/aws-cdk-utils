---
to: packages/<%=name%>/tsconfig.json
---
{
  "extends": "@tsconfig/node14",
  "compilerOptions": { "outDir": "dist", "rootDir": "src", "composite": true }
}
