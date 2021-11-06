---
to: packages/<%=name%>/tsconfig.json
---
{
  "extends": "@tsconfig/node14",
  "exclude": ["__test__", "dist"],
  "compilerOptions": { "outDir": "dist", "rootDir": "src", "composite": true }
}
