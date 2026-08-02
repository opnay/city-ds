import { Button } from '@opnay/city-ds-react/button';
import { FilterBar } from '@opnay/city-ds-react/filter-bar';
import { Input } from '@opnay/city-ds-react/input';

const appearances = ['plain', 'band', 'outline'] as const;
const densities = ['comfortable', 'compact'] as const;

export default function FilterBarMatrixExample() {
  return (
    <div className="city-docs-example-stack">
      {appearances.flatMap((appearance) =>
        densities.map((density) => (
          <FilterBar
            key={`${appearance}-${density}`}
            actions={
              <Button size="sm" variant="outline">
                적용
              </Button>
            }
            appearance={appearance}
            density={density}
          >
            <Input
              aria-label={`${appearance} ${density} 검색`}
              placeholder={`${appearance} · ${density}`}
            />
          </FilterBar>
        )),
      )}
    </div>
  );
}
