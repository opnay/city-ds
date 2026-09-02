import { Field } from '@opnay/city-ds-react/field';
import { SearchInput } from '@opnay/city-ds-react/search-input';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function SearchInputSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <Field.Root>
            <Field.Label>문서 검색</Field.Label>
            <SearchInput.Root defaultValue="city" size={size}>
              <SearchInput.Group>
                <SearchInput.Input />
                <SearchInput.Clear />
                <SearchInput.Submit aria-label="검색" />
              </SearchInput.Group>
            </SearchInput.Root>
          </Field.Root>
        </div>
      ))}
    </div>
  );
}
