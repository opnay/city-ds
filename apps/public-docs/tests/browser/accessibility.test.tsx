import { render } from '@testing-library/react';
import axe from 'axe-core';
import { createMemoryHistory, RouterContextProvider } from '@tanstack/react-router';

import { describe, expect, it } from 'vitest';

import { createDocsRouter } from '../../src/router';

import type { ComponentPageData } from '../../src/docs/types';

const documents = import.meta.glob<{ pageData: ComponentPageData }>(
  '../../src/docs/components/*/page-data.tsx',
  { eager: true },
);
const examples = Object.entries(documents).flatMap(([path, { pageData }]) => {
  const options = Object.fromEntries(
    (pageData.previewOptionAxes ?? pageData.optionAxes).map(({ name, defaultValue, values }) => {
      const value = defaultValue ?? values[0];
      const boolean = values.length === 2 && values.includes('false') && values.includes('true');
      return [name, boolean ? value === 'true' : value];
    }),
  );

  return pageData.examples.map((example) => ({
    ...example,
    slug: path.split('/').at(-2),
    props: example.configurable ? options : {},
  }));
});

describe.each(['light', 'dark'])('documented examples accessibility in %s theme', (theme) => {
  it.each(examples)('checks $slug / $id', async ({ Component, props }) => {
    document.documentElement.dataset.theme = theme;
    const router = createDocsRouter(createMemoryHistory({ initialEntries: ['/'] }));
    await router.load();
    const { container } = render(
      <RouterContextProvider router={router}>
        <Component {...props} />
      </RouterContextProvider>,
    );
    for (const viewport of container.querySelectorAll<HTMLElement>(
      '[data-city-scroll-area-viewport]',
    )) {
      await expect.poll(() => viewport.tabIndex).toBe(0);
    }
    await Promise.all(
      document
        .getAnimations()
        .filter(({ effect }) => Number.isFinite(effect?.getComputedTiming().endTime))
        .map((animation) => animation.finished),
    );
    const { violations } = await axe.run(
      {
        include: [container],
        exclude: ['[data-base-ui-focus-guard]'],
      },
      {
        // Standalone examples do not own page landmarks; this matches the old addon policy.
        rules: { region: { enabled: false } },
      },
    );

    expect(
      violations.map(({ id, nodes }) => ({
        id,
        elements: nodes.map(({ target, html, failureSummary }) => ({
          target,
          html,
          failureSummary,
        })),
      })),
    ).toEqual([]);
  });
});
