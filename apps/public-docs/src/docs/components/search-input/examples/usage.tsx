import { useState } from 'react';
import { SearchInput } from '@opnay/city-ds-react/search-input';

export default function SearchInputUsageExample() {
  const [submitted, setSubmitted] = useState('');
  const [value, setValue] = useState('city');

  return (
    <div className="city-docs-example-stack">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const query = new FormData(event.currentTarget).get('query');
          setSubmitted(typeof query === 'string' ? query : '');
        }}
      >
        <SearchInput.Root onValueChange={setValue} value={value}>
          <SearchInput.Group>
            <SearchInput.Input aria-label="문서 검색" name="query" placeholder="컴포넌트 검색" />
            <SearchInput.Clear />
            <SearchInput.Submit aria-label="검색" />
          </SearchInput.Group>
        </SearchInput.Root>
      </form>
      <output className="city-text-caption">
        {value || '빈 검색어'}
        {submitted ? ` · 제출됨: ${submitted}` : ''}
      </output>
    </div>
  );
}
