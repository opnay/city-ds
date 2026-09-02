import { useState } from 'react';
import { SearchInput } from '@opnay/city-ds-react/search-input';

export default function SearchInputUsageExample() {
  const [submitted, setSubmitted] = useState('');
  const [value, setValue] = useState('city');

  return (
    <div className="city-docs-example-stack">
      <SearchInput.Root onSubmit={setSubmitted} onValueChange={setValue} value={value}>
        <SearchInput.Group>
          <SearchInput.Input aria-label="문서 검색" placeholder="컴포넌트 검색" />
          <SearchInput.Clear />
          <SearchInput.Submit aria-label="검색" />
        </SearchInput.Group>
      </SearchInput.Root>
      <output className="city-text-caption">
        {value || '빈 검색어'}
        {submitted ? ` · 제출됨: ${submitted}` : ''}
      </output>
    </div>
  );
}
