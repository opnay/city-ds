import { Field } from '@opnay/city-ds-react/field';
import { SearchInput } from '@opnay/city-ds-react/search-input';

export default function SearchInputClearExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">빈 검색어에서 숨김</span>
        <Field.Root>
          <Field.Label>문서 검색</Field.Label>
          <SearchInput.Root>
            <SearchInput.Group>
              <SearchInput.Input placeholder="기본 동작" />
              <SearchInput.Clear />
            </SearchInput.Group>
          </SearchInput.Root>
        </Field.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">항상 표시</span>
        <Field.Root>
          <Field.Label>문서 검색</Field.Label>
          <SearchInput.Root>
            <SearchInput.Group>
              <SearchInput.Input placeholder="항상 표시" />
              <SearchInput.Clear hideWhenEmpty={false} />
            </SearchInput.Group>
          </SearchInput.Root>
        </Field.Root>
      </div>
    </div>
  );
}
