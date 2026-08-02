import { useState } from 'react';
import { Switch } from '@opnay/city-ds-react/switch';
export default function SwitchStatesExample() {
  const [checked, setChecked] = useState(true);
  return (
    <div className="city-docs-example-row">
      <Switch aria-label="작은 비제어 알림" defaultChecked size="sm" />
      <Switch aria-label="제어된 알림" checked={checked} onCheckedChange={setChecked} size="md" />
      <Switch aria-label="꺼진 알림" size="md" />
      <Switch aria-label="비활성 알림" defaultChecked disabled size="lg" />
    </div>
  );
}
