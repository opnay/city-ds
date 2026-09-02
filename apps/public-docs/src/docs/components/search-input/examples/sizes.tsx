import { SearchInput } from '@opnay/city-ds-react/search-input';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function SearchInputSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <SearchInput.Root defaultValue="city" size={size}>
            <SearchInput.Group>
              <SearchInput.Input aria-label="문서 검색" />
              <SearchInput.Clear />
              <SearchInput.Submit aria-label="검색" />
            </SearchInput.Group>
          </SearchInput.Root>
        </div>
      ))}
    </div>
  );
}
