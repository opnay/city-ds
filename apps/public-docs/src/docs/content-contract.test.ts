import { describe, expect, it } from 'vitest';

import type { ComponentPageData, DocModule } from './types';

const pageDataModules = import.meta.glob<{ pageData: ComponentPageData }>(
  './components/*/page-data.tsx',
  { eager: true },
);
const documentModules = import.meta.glob<DocModule>('./components/*/index.mdx');
const REQUIRED_COMBINATION_AXES = {
  alert: ['tone', 'appearance'],
  badge: ['mode', 'tone', 'appearance'],
  combobox: ['size', 'multiple'],
  drawer: ['side', 'size'],
  'filter-bar': ['appearance', 'density'],
  progress: ['shape', 'status', 'size'],
  skeleton: ['variant', 'size'],
  table: ['size', 'variant'],
  toast: ['tone'],
  'toggle-group': ['variant', 'pressed'],
} as const;

function slugFromPath(path: string): string {
  const match = /components\/([^/]+)\//.exec(path);
  if (!match?.[1]) throw new Error(`컴포넌트 slug를 읽을 수 없습니다: ${path}`);
  return match[1];
}

function cartesianCombinations(
  axes: readonly { name: string; values: readonly string[] }[],
): string[] {
  return axes.reduce<string[]>(
    (combinations, axis) =>
      combinations.flatMap((combination) =>
        axis.values.map((value) =>
          combination.length === 0
            ? `${axis.name}=${value}`
            : `${combination}|${axis.name}=${value}`,
        ),
      ),
    [''],
  );
}

describe('component document content', () => {
  it('provides page data and lazy MDX for every public component', () => {
    expect(Object.keys(pageDataModules)).toHaveLength(39);
    expect(Object.keys(documentModules)).toHaveLength(39);
    expect(Object.keys(pageDataModules).map(slugFromPath).sort()).toEqual(
      Object.keys(documentModules).map(slugFromPath).sort(),
    );
  });

  it.each(Object.entries(pageDataModules))(
    '%s covers its finite options and examples',
    (_, module) => {
      const { pageData } = module;
      const exampleIds = pageData.examples.map((example) => example.id);

      expect(pageData.api.length).toBeGreaterThan(0);
      expect(pageData.examples.length).toBeGreaterThan(0);
      expect(pageData.optionAxes.length).toBeGreaterThan(0);
      expect(new Set(exampleIds).size).toBe(exampleIds.length);
      expect(exampleIds).toContain(pageData.featuredExampleId);

      for (const example of pageData.examples) {
        expect(example.Component).toBeTypeOf('function');
        expect(example.coverage.length).toBeGreaterThan(0);

        if (example.files) {
          expect(example.files.length).toBeGreaterThanOrEqual(2);
          expect(new Set(example.files.map((file) => file.filename)).size).toBe(
            example.files.length,
          );

          for (const file of example.files) {
            expect(file.filename.trim().length).toBeGreaterThan(0);
            expect(file.language.trim().length).toBeGreaterThan(0);
            expect(file.source.trim().length).toBeGreaterThan(0);
          }
        } else {
          expect(example.filename).toMatch(/\.tsx$/);
          expect(example.source.trim().length).toBeGreaterThan(0);
          expect(example.source).not.toMatch(
            /^import[^\n]*;\n(?:import[^\n]*;\n)*(?:const|let|type|interface|function|export default function)/,
          );
          expect(example.source).not.toMatch(
            /^}\n(?:const|let|type|interface|function|export default function)/m,
          );
        }
      }

      for (const axis of pageData.optionAxes) {
        if (axis.control === 'switch') {
          expect([...axis.values].sort()).toEqual(['false', 'true']);
        }

        const covered = new Set([
          ...(axis.defaultValue === undefined ? [] : [axis.defaultValue]),
          ...pageData.examples.flatMap((example) =>
            example.coverage
              .filter((coverage) => coverage.axis === axis.name)
              .flatMap((coverage) => coverage.values),
          ),
        ]);

        expect([...axis.values].filter((value) => !covered.has(value))).toEqual([]);
      }
    },
  );

  it('lazy-loads every MDX document module', async () => {
    const modules = await Promise.all(Object.values(documentModules).map((load) => load()));

    expect(modules).toHaveLength(39);
    expect(modules.every((module) => typeof module.default === 'function')).toBe(true);
  });

  it('separates Combobox single and multiple previews without internal labels', () => {
    const pageData = pageDataModules['./components/combobox/page-data.tsx']?.pageData;
    const selectionExamples = pageData?.examples.filter((example) =>
      ['combobox-single', 'combobox-multiple'].includes(example.id),
    );

    expect(selectionExamples?.map((example) => example.id)).toEqual([
      'combobox-single',
      'combobox-multiple',
    ]);
    expect(
      selectionExamples?.every(
        (example) =>
          typeof example.source === 'string' && !example.source.includes('city-docs-example-label'),
      ),
    ).toBe(true);
  });

  it.each(Object.entries(REQUIRED_COMBINATION_AXES))(
    '%s covers every required option combination',
    (slug, axisNames) => {
      const module = pageDataModules[`./components/${slug}/page-data.tsx`];
      expect(module).toBeDefined();

      const axes = axisNames.map((name) => {
        const axis = module?.pageData.optionAxes.find((item) => item.name === name);
        if (!axis) throw new Error(`${slug} 문서에 ${name} 옵션 축이 없습니다.`);
        return axis;
      });
      const required = cartesianCombinations(axes);
      const covered = new Set(
        module?.pageData.examples.flatMap((example) =>
          example.coverage.flatMap((coverage) => coverage.combinations ?? []),
        ),
      );

      expect(required.filter((combination) => !covered.has(combination))).toEqual([]);
    },
  );
});
