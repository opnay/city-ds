import { SearchField } from '@opnay/city-ds-react/search-field';

export default function SearchFieldClearExample() {
  return (
    <div className="city-docs-example-stack">
      <SearchField.Root>
        <SearchField.Label>빈 검색어에서 숨김</SearchField.Label>
        <SearchField.Group>
          <SearchField.Input placeholder="기본 동작" />
          <SearchField.Clear />
        </SearchField.Group>
      </SearchField.Root>
      <SearchField.Root>
        <SearchField.Label>빈 검색어에서도 표시</SearchField.Label>
        <SearchField.Group>
          <SearchField.Input placeholder="항상 표시" />
          <SearchField.Clear hideWhenEmpty={false} />
        </SearchField.Group>
      </SearchField.Root>
    </div>
  );
}
