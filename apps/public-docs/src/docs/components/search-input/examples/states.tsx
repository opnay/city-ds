import { Field } from '@opnay/city-ds-react/field';
import { SearchInput } from '@opnay/city-ds-react/search-input';

export default function SearchInputStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">로딩</span>
        <Field.Root>
          <Field.Label>문서 검색</Field.Label>
          <SearchInput.Root defaultValue="대기" loading>
            <SearchInput.Group>
              <SearchInput.Input />
              <SearchInput.Loading>검색 중</SearchInput.Loading>
            </SearchInput.Group>
          </SearchInput.Root>
        </Field.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">비활성</span>
        <Field.Root disabled>
          <Field.Label>문서 검색</Field.Label>
          <SearchInput.Root defaultValue="보관됨" disabled>
            <SearchInput.Group>
              <SearchInput.Input />
            </SearchInput.Group>
          </SearchInput.Root>
        </Field.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">오류</span>
        <Field.Root invalid>
          <Field.Label>문서 검색</Field.Label>
          <SearchInput.Root defaultValue="x" invalid>
            <SearchInput.Group>
              <SearchInput.Input />
            </SearchInput.Group>
          </SearchInput.Root>
          <Field.Error match>두 글자 이상 입력하십시오.</Field.Error>
        </Field.Root>
      </div>
    </div>
  );
}
