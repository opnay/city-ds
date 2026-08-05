import { SearchField } from '@opnay/city-ds-react/search-field';

const sizes = ['sm', 'md', 'lg'] as const;

export default function SearchFieldSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <SearchField.Root defaultValue="city" key={size} size={size}>
          <SearchField.Label>{size} 문서 검색</SearchField.Label>
          <SearchField.Group>
            <SearchField.Input />
            <SearchField.Clear />
            <SearchField.Submit aria-label={`${size} 검색`} />
          </SearchField.Group>
        </SearchField.Root>
      ))}
    </div>
  );
}
