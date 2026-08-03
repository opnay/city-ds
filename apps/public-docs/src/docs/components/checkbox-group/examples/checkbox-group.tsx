import { useState } from 'react';
import { CheckboxGroup } from '@opnay/city-ds-react/checkbox-group';
export default function CheckboxGroupExample() {
  const [value, setValue] = useState<string[]>(['email']);
  return (
    <div className="city-docs-example-stack">
      <CheckboxGroup aria-label="알림 채널" onValueChange={setValue} size="md" value={value}>
        <CheckboxGroup.Item value="email">이메일</CheckboxGroup.Item>
        <CheckboxGroup.Item value="push">푸시</CheckboxGroup.Item>
        <CheckboxGroup.Item disabled value="sms">
          문자
        </CheckboxGroup.Item>
      </CheckboxGroup>
      <CheckboxGroup aria-label="작은 비제어 채널" defaultValue={['push']} size="sm">
        <CheckboxGroup.Item value="email">이메일</CheckboxGroup.Item>
        <CheckboxGroup.Item value="push">푸시</CheckboxGroup.Item>
      </CheckboxGroup>
      <CheckboxGroup aria-label="큰 비제어 채널" size="lg">
        <CheckboxGroup.Item value="email">이메일</CheckboxGroup.Item>
      </CheckboxGroup>
    </div>
  );
}
