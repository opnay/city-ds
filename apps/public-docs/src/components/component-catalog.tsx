import { useMemo, useState } from 'react';
import { ArrowRight, PackageSearch } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@opnay/city-ds-react/button';
import { EmptyState } from '@opnay/city-ds-react/empty-state';
import { Field } from '@opnay/city-ds-react/field';
import { FilterBar } from '@opnay/city-ds-react/filter-bar';
import { SearchInput } from '@opnay/city-ds-react/search-input';
import { Select } from '@opnay/city-ds-react/select';

import { CATEGORY_LABELS, COMPONENT_CATEGORIES, filterComponentDocs } from '../docs/doc-catalog';
import type { ComponentCategory } from '../docs/types';
import { GuidePage } from './doc-page';

const CATEGORY_ITEMS: Record<ComponentCategory | 'all', string> = {
  all: '모든 범주',
  ...CATEGORY_LABELS,
};

export function ComponentCatalog() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ComponentCategory | 'all'>('all');
  const results = useMemo(() => filterComponentDocs(query, category), [category, query]);

  const reset = () => {
    setQuery('');
    setCategory('all');
  };

  return (
    <GuidePage
      description="사용 목적과 범주를 기준으로 컴포넌트를 찾고, 공개 옵션과 실제 조합 예제를 확인하십시오."
      eyebrow="Components"
      title="컴포넌트"
    >
      <FilterBar
        actions={
          <Button onClick={reset} size="sm" type="button" variant="outline">
            필터 초기화
          </Button>
        }
        appearance="band"
        aria-label="컴포넌트 필터"
        className="city-docs-catalog-filter"
      >
        <div className="city-docs-catalog-search">
          <Field.Root className="city-docs-catalog-search-input">
            <Field.Label className="city-docs-sr-only">컴포넌트 검색</Field.Label>
            <SearchInput.Root onValueChange={setQuery} size="sm" value={query}>
              <SearchInput.Group>
                <SearchInput.Input placeholder="Button, 버튼, 폼…" />
                <SearchInput.Clear aria-label="검색어 지우기" />
              </SearchInput.Group>
            </SearchInput.Root>
          </Field.Root>
        </div>
        <div className="city-docs-catalog-category">
          <Select.Root
            items={CATEGORY_ITEMS}
            onValueChange={(value) => setCategory((value as ComponentCategory | null) ?? 'all')}
            size="sm"
            value={category}
          >
            <Select.Label className="city-docs-sr-only">컴포넌트 범주</Select.Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner sideOffset={6}>
                <Select.Popup>
                  <Select.List>
                    {Object.entries(CATEGORY_ITEMS).map(([value, label]) => (
                      <Select.Item key={value} value={value}>
                        <Select.ItemIndicator />
                        <Select.ItemText>{label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </div>
      </FilterBar>

      <p className="city-docs-results-count city-text-supporting" aria-live="polite">
        컴포넌트 {results.length}개
      </p>

      {results.length === 0 ? (
        <EmptyState.Root className="city-docs-catalog-empty-state">
          <EmptyState.Icon>
            <PackageSearch />
          </EmptyState.Icon>
          <EmptyState.Title>조건에 맞는 컴포넌트가 없습니다.</EmptyState.Title>
          <EmptyState.Description>
            이름을 다시 입력하거나 범주 필터를 초기화하십시오.
          </EmptyState.Description>
          <EmptyState.Actions>
            <Button onClick={reset} type="button" variant="outline">
              필터 초기화
            </Button>
          </EmptyState.Actions>
        </EmptyState.Root>
      ) : (
        <div className="city-docs-component-groups">
          {COMPONENT_CATEGORIES.map((group) => {
            const entries = results.filter((entry) => entry.category === group);
            if (entries.length === 0) return null;

            return (
              <section aria-labelledby={`catalog-${group}`} key={group}>
                <h2 className="city-text-section-title" id={`catalog-${group}`}>
                  {CATEGORY_LABELS[group]}
                </h2>
                <div className="city-docs-component-grid">
                  {entries.map((entry) => (
                    <Link key={entry.slug} params={{ slug: entry.slug }} to="/components/$slug">
                      <span>
                        <strong>{entry.title}</strong>
                        <span className="city-text-supporting">{entry.description}</span>
                      </span>
                      <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </GuidePage>
  );
}
