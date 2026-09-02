import { useState } from 'react';
import { Field } from '@opnay/city-ds-react/field';
import { SearchInput } from '@opnay/city-ds-react/search-input';

export default function SearchInputUsageExample() {
  const [submitted, setSubmitted] = useState('');
  const [value, setValue] = useState('city');

  return (
    <Field.Root>
      <Field.Label>문서 검색</Field.Label>
      <SearchInput.Root onSubmit={setSubmitted} onValueChange={setValue} value={value}>
        <SearchInput.Group>
          <SearchInput.Input placeholder="컴포넌트 검색" />
          <SearchInput.Clear />
          <SearchInput.Submit aria-label="검색" />
        </SearchInput.Group>
      </SearchInput.Root>
      <Field.Description>
        {value || '빈 검색어'}
        {submitted ? ` · 제출됨: ${submitted}` : ''}
      </Field.Description>
    </Field.Root>
  );
}
