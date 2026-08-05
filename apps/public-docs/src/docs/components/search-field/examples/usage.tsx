import { useState } from 'react';
import { SearchField } from '@opnay/city-ds-react/search-field';

export default function SearchFieldUsageExample() {
  const [submitted, setSubmitted] = useState('');
  const [value, setValue] = useState('city');

  return (
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
  );
}
