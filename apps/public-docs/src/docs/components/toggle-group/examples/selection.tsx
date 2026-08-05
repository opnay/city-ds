import { useState } from 'react';
import { ToggleGroup } from '@opnay/city-ds-react/toggle-group';

export default function ToggleGroupSelectionExample() {
  const [value, setValue] = useState(['grid']);

  return (
    <div className="city-docs-example-stack">
      <ToggleGroup aria-label="단일 보기" defaultValue={['grid']} multiple={false}>
        <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
        <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup aria-label="복수 보기" defaultValue={['grid']} multiple>
        <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
        <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup aria-label="제어된 보기" onValueChange={setValue} value={value}>
        <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
        <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
        <ToggleGroup.Item disabled value="map">
          지도
        </ToggleGroup.Item>
      </ToggleGroup>
    </div>
  );
}
