import { useState } from 'react';
import { ToggleGroup } from '@opnay/city-ds-react/toggle-group';

import { HomeShowcase, type ShowcaseCategory } from './home-showcase';

const FILTERS: readonly { label: string; value: ShowcaseCategory }[] = [
  { label: '전체', value: 'all' },
  { label: '워크스페이스', value: 'workspace' },
  { label: '커머스', value: 'commerce' },
  { label: '지원', value: 'support' },
  { label: '일정', value: 'scheduling' },
  { label: '설정', value: 'settings' },
];

const FILTER_COUNTS: Record<ShowcaseCategory, number> = {
  all: 10,
  commerce: 2,
  scheduling: 1,
  settings: 2,
  support: 2,
  workspace: 3,
};

export function HomePage() {
  const [category, setCategory] = useState<ShowcaseCategory>('all');

  return (
    <article className="city-docs-home">
      <h1 className="city-docs-sr-only">city-ds organism gallery</h1>
      <div className="city-docs-home-filterbar">
        <ToggleGroup
          aria-label="예제 범주"
          className="city-docs-home-filters"
          multiple={false}
          onValueChange={(value) => {
            const next = value[0] as ShowcaseCategory | undefined;
            if (next) setCategory(next);
          }}
          size="sm"
          value={[category]}
          variant="ghost"
        >
          {FILTERS.map((filter) => (
            <ToggleGroup.Item key={filter.value} value={filter.value}>
              {filter.label}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup>
        <p aria-live="polite">organism {FILTER_COUNTS[category]}개</p>
      </div>
      <HomeShowcase category={category} />
    </article>
  );
}
