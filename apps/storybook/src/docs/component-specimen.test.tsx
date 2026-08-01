import { renderToStaticMarkup } from 'react-dom/server';
import { Badge, Button, Input, Table } from '@opnay/city-ds-react';
import '@opnay/city-ds-react/styles.css';
import { describe, expect, it } from 'vitest';

import { ComponentSpecimen } from './component-specimen';

const storybookDocs = import.meta.glob('../stories/*.mdx', {
  eager: true,
  import: 'default',
  query: '?raw',
});

const cityImportPattern = /import\s*{([\s\S]*?)}\s*from '@opnay\/city-ds-react';/;

function getImportedComponentNames(source: string) {
  const cityImport = source.match(cityImportPattern)?.[1];

  if (!cityImport) {
    return [];
  }

  return cityImport
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
}

function getSpecimenRanges(source: string) {
  const openingTags = [...source.matchAll(/<ComponentSpecimen>/g)];
  const closingTags = [...source.matchAll(/<\/ComponentSpecimen>/g)];

  expect(closingTags).toHaveLength(openingTags.length);

  return openingTags.map((openingTag, index) => ({
    end: closingTags[index]?.index ?? -1,
    start: openingTag.index ?? -1,
  }));
}

describe('ComponentSpecimen', () => {
  it('keeps city-ds typography outside hostile Docs element styles', () => {
    const style = document.createElement('style');
    const host = document.createElement('div');

    style.textContent = `
      .city-docs-host :where(span:not(.sb-unstyled, .sb-unstyled span)),
      .city-docs-host :where(button:not(.sb-unstyled, .sb-unstyled button)),
      .city-docs-host :where(input:not(.sb-unstyled, .sb-unstyled input)) {
        font-size: 16px;
        line-height: 24px;
      }
    `;
    host.className = 'city-docs-host';
    host.innerHTML = renderToStaticMarkup(
      <ComponentSpecimen>
        <Badge size="md">운영 중</Badge>
        <Button size="md">저장</Button>
        <Input aria-label="프로젝트" defaultValue="Transit Map" size="md" />
      </ComponentSpecimen>,
    );
    document.head.append(style);
    document.body.append(host);

    try {
      const badge = host.querySelector<HTMLElement>('[data-city-badge]');
      const button = host.querySelector<HTMLElement>('button');
      const input = host.querySelector<HTMLElement>('input');

      expect(
        host.querySelector('[data-city-docs-specimen]')?.classList.contains('sb-unstyled'),
      ).toBe(true);
      expect(badge).not.toBeNull();
      expect(button).not.toBeNull();
      expect(input).not.toBeNull();
      expect(getComputedStyle(badge!).fontSize).toBe('10px');
      expect(getComputedStyle(badge!).lineHeight).toBe('12px');
      expect(getComputedStyle(button!).fontSize).toBe('14px');
      expect(getComputedStyle(button!).lineHeight).toBe('20px');
      expect(getComputedStyle(input!).fontSize).toBe('14px');
      expect(getComputedStyle(input!).lineHeight).toBe('20px');
    } finally {
      host.remove();
      style.remove();
    }
  });

  it('keeps city-ds table rows outside the Storybook Docs light stripe', () => {
    const style = document.createElement('style');
    const host = document.createElement('div');

    style.textContent = `
      .city-docs-host :where(table:not(.sb-anchor, .sb-unstyled, .sb-unstyled table))
        tr:nth-of-type(2n) {
        background-color: rgb(246, 249, 252);
      }
    `;
    host.className = 'city-docs-host';
    host.innerHTML = renderToStaticMarkup(
      <ComponentSpecimen>
        <Table.Root aria-label="Size contract">
          <Table.Body>
            <Table.Row>
              <Table.Cell>sm</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>md</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </ComponentSpecimen>,
    );
    document.head.append(style);
    document.body.append(host);

    try {
      const rows = host.querySelectorAll<HTMLElement>('[data-city-table-row]');

      expect(rows).toHaveLength(2);
      expect(getComputedStyle(rows[1]!).backgroundColor).not.toBe('rgb(246, 249, 252)');
    } finally {
      host.remove();
      style.remove();
    }
  });

  it('uses city-ds Table for the control contract documents', () => {
    for (const path of ['../stories/control-size.mdx', '../stories/control-typography.mdx']) {
      const source = storybookDocs[path];

      expect(source).toContain('<Table.Root');
      expect(source).not.toMatch(/<table(?:\s|>)/);
    }
  });

  for (const [path, source] of Object.entries(storybookDocs)) {
    const componentNames = getImportedComponentNames(source);

    if (componentNames.length === 0) {
      continue;
    }

    it(`${path} keeps every city-ds component inside the specimen boundary`, () => {
      expect(source).toContain("import { ComponentSpecimen } from '../docs/component-specimen';");

      const specimenRanges = getSpecimenRanges(source);
      expect(specimenRanges.length).toBeGreaterThan(0);

      for (const componentName of componentNames) {
        const componentTags = [
          ...source.matchAll(new RegExp(`<${componentName}(?:[.\\s/>])`, 'g')),
        ];

        for (const componentTag of componentTags) {
          expect(
            specimenRanges.some(
              ({ start, end }) =>
                (componentTag.index ?? -1) > start && (componentTag.index ?? -1) < end,
            ),
          ).toBe(true);
        }
      }
    });
  }
});
