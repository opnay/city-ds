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
      <RadioGroup aria-label="제어된 공개 범위" onValueChange={setValue} value={value}>
        <Items />
        <RadioGroup.Item disabled value="public">
          전체 공개
        </RadioGroup.Item>
      </RadioGroup>
      <RadioGroup aria-label="비제어 공개 범위" defaultValue="team">
        <Items />
      </RadioGroup>
    </div>
  );
}
