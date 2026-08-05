import { useState } from 'react';
import { CheckboxGroup } from '@opnay/city-ds-react/checkbox-group';

export default function CheckboxGroupSelectionExample() {
  const [value, setValue] = useState<string[]>(['email']);

  return (
    <div className="city-docs-example-stack">
      <CheckboxGroup aria-label="제어된 알림 채널" onValueChange={setValue} value={value}>
        <CheckboxGroup.Item value="email">이메일</CheckboxGroup.Item>
        <CheckboxGroup.Item value="push">푸시</CheckboxGroup.Item>
        <CheckboxGroup.Item disabled value="sms">
          문자
        </CheckboxGroup.Item>
      </CheckboxGroup>
      <CheckboxGroup aria-label="비제어 알림 채널" defaultValue={['push']}>
        <CheckboxGroup.Item value="email">이메일</CheckboxGroup.Item>
        <CheckboxGroup.Item value="push">푸시</CheckboxGroup.Item>
      </CheckboxGroup>
    </div>
  );
}
