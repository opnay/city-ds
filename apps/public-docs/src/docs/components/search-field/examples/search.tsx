import { useState } from 'react';
import { SearchField } from '@opnay/city-ds-react/search-field';
export default function SearchFieldExample() {
  const [submitted, setSubmitted] = useState('');
  const [value, setValue] = useState('city');
  return (
    <div className="city-docs-example-stack">
      <SearchField.Root onSubmit={setSubmitted} onValueChange={setValue} value={value}>
        <SearchField.Label>문서 검색</SearchField.Label>
        <SearchField.Group>
          <SearchField.Input placeholder="컴포넌트 검색" />
          <SearchField.Clear />
          <SearchField.Submit aria-label="검색" />
        </SearchField.Group>
        <SearchField.Description>
          {value || '빈 검색어'}
          {submitted ? ` · 제출됨: ${submitted}` : ''}
        </SearchField.Description>
      </SearchField.Root>
      <SearchField.Root defaultValue="대기" loading size="sm">
        <SearchField.Label>로딩 검색</SearchField.Label>
        <SearchField.Group>
          <SearchField.Input />
          <SearchField.Loading>검색 중</SearchField.Loading>
        </SearchField.Group>
      </SearchField.Root>
      <SearchField.Root defaultValue="보관됨" disabled size="lg">
        <SearchField.Label>비활성 검색</SearchField.Label>
        <SearchField.Group>
          <SearchField.Input />
        </SearchField.Group>
      </SearchField.Root>
      <SearchField.Root defaultValue="x" invalid>
        <SearchField.Label>오류 검색</SearchField.Label>
        <SearchField.Group>
          <SearchField.Input />
        </SearchField.Group>
        <SearchField.Error match>두 글자 이상 입력하십시오.</SearchField.Error>
      </SearchField.Root>
      <SearchField.Root>
        <SearchField.Label>항상 지우기 표시</SearchField.Label>
        <SearchField.Group>
          <SearchField.Input placeholder="빈 검색어" />
          <SearchField.Clear hideWhenEmpty={false} />
        </SearchField.Group>
      </SearchField.Root>
    </div>
  );
}
