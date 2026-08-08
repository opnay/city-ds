import { SearchField } from '@opnay/city-ds-react/search-field';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function SearchFieldSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <SearchField.Root defaultValue="city" size={size}>
            <SearchField.Label>문서 검색</SearchField.Label>
            <SearchField.Group>
              <SearchField.Input />
              <SearchField.Clear />
              <SearchField.Submit aria-label="검색" />
            </SearchField.Group>
          </SearchField.Root>
        </div>
      ))}
    </div>
  );
}
