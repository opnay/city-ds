import { useState } from 'react';
import { Calendar } from '@opnay/city-ds-react/calendar';
import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { ToggleGroup } from '@opnay/city-ds-react/toggle-group';

const today = new Date(2026, 6, 15);

type CalendarSize = 'sm' | 'md' | 'lg';
type CalendarState = 'default' | 'readOnly' | 'invalid' | 'disabled';

export default function CalendarPlaygroundExample() {
  const [value, setValue] = useState<Date | null>(today);
  const [size, setSize] = useState<CalendarSize[]>(['md']);
  const [state, setState] = useState<CalendarState[]>(['default']);
  const [showOutsideDays, setShowOutsideDays] = useState(true);
  const selectedSize = size[0] ?? 'md';
  const selectedState = state[0] ?? 'default';

  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-row">
        <span className="city-docs-example-label">크기</span>
        <ToggleGroup
          aria-label="달력 크기"
          multiple={false}
          onValueChange={(nextSize) => {
            if (nextSize.length > 0) setSize(nextSize);
          }}
          size="sm"
          value={size}
          variant="outline"
        >
          <ToggleGroup.Item value="sm">sm</ToggleGroup.Item>
          <ToggleGroup.Item value="md">md</ToggleGroup.Item>
          <ToggleGroup.Item value="lg">lg</ToggleGroup.Item>
        </ToggleGroup>
      </div>
      <div className="city-docs-example-row">
        <span className="city-docs-example-label">상태</span>
        <ToggleGroup
          aria-label="달력 상태"
          multiple={false}
          onValueChange={(nextState) => {
            if (nextState.length > 0) setState(nextState);
          }}
          size="sm"
          value={state}
          variant="outline"
        >
          <ToggleGroup.Item value="default">기본</ToggleGroup.Item>
          <ToggleGroup.Item value="readOnly">읽기</ToggleGroup.Item>
          <ToggleGroup.Item value="invalid">오류</ToggleGroup.Item>
          <ToggleGroup.Item value="disabled">비활성</ToggleGroup.Item>
        </ToggleGroup>
      </div>
      <label className="city-docs-example-row">
        <Checkbox checked={showOutsideDays} onCheckedChange={setShowOutsideDays} />
        인접 월 날짜 표시
      </label>
      <Calendar
        aria-label="날짜 선택"
        disabled={selectedState === 'disabled'}
        invalid={selectedState === 'invalid'}
        onValueChange={setValue}
        readOnly={selectedState === 'readOnly'}
        showOutsideDays={showOutsideDays}
        size={selectedSize}
        today={today}
        value={value}
      />
    </div>
  );
}
