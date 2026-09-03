export function createPlaygroundSource(importPath: string, names: string) {
  return `import { ${names} } from '${importPath}';

// Preview 옵션 사이드바에서 대표 props를 조절합니다.`;
}
