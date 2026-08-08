import { SearchField } from '@opnay/city-ds-react/search-field';

export default function SearchFieldStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">로딩</span>
        <SearchField.Root defaultValue="대기" loading>
          <SearchField.Label>문서 검색</SearchField.Label>
          <SearchField.Group>
            <SearchField.Input />
            <SearchField.Loading>검색 중</SearchField.Loading>
          </SearchField.Group>
        </SearchField.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">비활성</span>
        <SearchField.Root defaultValue="보관됨" disabled>
          <SearchField.Label>문서 검색</SearchField.Label>
          <SearchField.Group>
            <SearchField.Input />
          </SearchField.Group>
        </SearchField.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">오류</span>
        <SearchField.Root defaultValue="x" invalid>
          <SearchField.Label>문서 검색</SearchField.Label>
          <SearchField.Group>
            <SearchField.Input />
          </SearchField.Group>
          <SearchField.Error match>두 글자 이상 입력하십시오.</SearchField.Error>
        </SearchField.Root>
      </div>
    </div>
  );
}
