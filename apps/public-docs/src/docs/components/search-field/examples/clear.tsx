import { SearchField } from '@opnay/city-ds-react/search-field';

export default function SearchFieldClearExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">빈 검색어에서 숨김</span>
        <SearchField.Root>
          <SearchField.Label>문서 검색</SearchField.Label>
          <SearchField.Group>
            <SearchField.Input placeholder="기본 동작" />
            <SearchField.Clear />
          </SearchField.Group>
        </SearchField.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">항상 표시</span>
        <SearchField.Root>
          <SearchField.Label>문서 검색</SearchField.Label>
          <SearchField.Group>
            <SearchField.Input placeholder="항상 표시" />
            <SearchField.Clear hideWhenEmpty={false} />
          </SearchField.Group>
        </SearchField.Root>
      </div>
    </div>
  );
}
