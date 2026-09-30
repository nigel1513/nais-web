import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // R3F는 useFrame 안에서 three.js 객체(uniform·geometry)를 직접 갱신하는 것이 표준 패턴이다.
    // React 상태가 아닌 GPU 객체이므로 React Compiler의 immutability 규칙을 이 폴더에서만 끈다.
    files: ["src/components/three/**"],
    rules: { "react-hooks/immutability": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".superpowers/**",
  ]),
]);

export default eslintConfig;
