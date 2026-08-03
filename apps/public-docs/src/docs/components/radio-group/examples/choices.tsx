import { useState } from 'react';
import { RadioGroup } from '@opnay/city-ds-react/radio-group';
function Items() {
  return (
    <>
      <RadioGroup.Item value="private">비공개</RadioGroup.Item>
      <RadioGroup.Item value="team">팀</RadioGroup.Item>
    </>
  );
}
export default function RadioGroupChoicesExample() {
  const [value, setValue] = useState('team');
  return (
    <div className="city-docs-example-stack">
      <RadioGroup aria-label="제어된 공개 범위" onValueChange={setValue} size="md" value={value}>
        <Items />
        <RadioGroup.Item disabled value="public">
          전체 공개
        </RadioGroup.Item>
      </RadioGroup>
      <RadioGroup aria-label="작은 비제어 범위" defaultValue="private" size="sm">
        <Items />
      </RadioGroup>
      <RadioGroup aria-label="큰 비제어 범위" defaultValue="team" size="lg">
        <Items />
      </RadioGroup>
    </div>
  );
}
