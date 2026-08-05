import { useState } from 'react';
import { Toggle } from '@opnay/city-ds-react/toggle';

export default function ToggleStatesExample() {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="city-docs-example-row">
      <Toggle defaultPressed>비제어 토글</Toggle>
      <Toggle onPressedChange={setPressed} pressed={pressed}>
        제어됨: {pressed ? '선택' : '해제'}
      </Toggle>
      <Toggle disabled>비활성 토글</Toggle>
    </div>
  );
}
