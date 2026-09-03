import { useState } from 'react';
import { ToggleGroup } from '@opnay/city-ds-react/toggle-group';

export default function ToggleGroupSelectionExample() {
  const [value, setValue] = useState(['bold']);

  return (
    <div className="city-docs-example-stack">
      <ToggleGroup aria-label="단일 열 고정" defaultValue={['left']} multiple={false}>
        <ToggleGroup.Item value="left">왼쪽 고정</ToggleGroup.Item>
        <ToggleGroup.Item value="right">오른쪽 고정</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup aria-label="복수 서식" defaultValue={['bold']} multiple>
        <ToggleGroup.Item value="bold">굵게</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">기울임</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup aria-label="제어된 서식" multiple onValueChange={setValue} value={value}>
        <ToggleGroup.Item value="bold">굵게</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">기울임</ToggleGroup.Item>
        <ToggleGroup.Item disabled value="underline">
          밑줄
        </ToggleGroup.Item>
      </ToggleGroup>
    </div>
  );
}
