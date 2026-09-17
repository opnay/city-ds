import { Button } from '@opnay/city-ds-react/button';
import { FilterBar } from '@opnay/city-ds-react/filter-bar';
import { Input } from '@opnay/city-ds-react/input';

const densities = ['comfortable', 'compact'] as const;

export default function FilterBarMatrixExample() {
  return (
    <div className="city-docs-example-stack">
      {densities.map((density) => (
        <div className="overflow-hidden rounded-city-md border border-city-border" key={density}>
          <div className="border-b border-city-border px-4 py-3">
            <FilterBar
              aria-label={`${density} 테이블 필터`}
              actions={
                <Button size="sm" variant="outline">
                  적용
                </Button>
              }
              density={density}
            >
              <Input aria-label={`${density} 검색`} placeholder={`${density} · table filters`} />
            </FilterBar>
          </div>
          <p className="px-4 py-3 text-sm text-city-muted-foreground">테이블 바로 위 필터 행</p>
        </div>
      ))}
    </div>
  );
}
