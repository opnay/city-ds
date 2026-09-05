import { SearchInput } from '@opnay/city-ds-react/search-input';

export default function SearchInputClearExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">빈 검색어에서 숨김·공간 유지</span>
        <SearchInput.Root>
          <SearchInput.Group>
            <SearchInput.Input aria-label="문서 검색" placeholder="기본 동작" />
            <SearchInput.Clear />
          </SearchInput.Group>
        </SearchInput.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">항상 표시</span>
        <SearchInput.Root>
          <SearchInput.Group>
            <SearchInput.Input aria-label="문서 검색" placeholder="항상 표시" />
            <SearchInput.Clear hideWhenEmpty={false} />
          </SearchInput.Group>
        </SearchInput.Root>
      </div>
    </div>
  );
}
