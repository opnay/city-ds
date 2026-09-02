import { SearchInput } from '@opnay/city-ds-react/search-input';

export default function SearchInputStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">로딩</span>
        <SearchInput.Root defaultValue="대기" loading>
          <SearchInput.Group>
            <SearchInput.Input aria-label="문서 검색" />
            <SearchInput.Loading>검색 중</SearchInput.Loading>
          </SearchInput.Group>
        </SearchInput.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">비활성</span>
        <SearchInput.Root defaultValue="보관됨" disabled>
          <SearchInput.Group>
            <SearchInput.Input aria-label="문서 검색" />
          </SearchInput.Group>
        </SearchInput.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">오류</span>
        <SearchInput.Root defaultValue="x" invalid>
          <SearchInput.Group>
            <SearchInput.Input aria-label="문서 검색" />
          </SearchInput.Group>
        </SearchInput.Root>
      </div>
    </div>
  );
}
