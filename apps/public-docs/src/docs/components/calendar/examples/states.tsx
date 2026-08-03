import { useState } from 'react';
import { Calendar } from '@opnay/city-ds-react/calendar';

const today = new Date(2026, 6, 15);

export default function CalendarStatesExample() {
  const [value, setValue] = useState<Date | null>(today);
  return (
    <div className="city-docs-example-grid">
      <Calendar
        aria-label="선택된 날짜"
        onValueChange={setValue}
        size="md"
        showOutsideDays
        today={today}
        value={value}
      />
      <Calendar
        aria-label="읽기 전용 날짜"
        defaultValue={today}
        readOnly
        showOutsideDays={false}
        size="sm"
        today={today}
      />
      <Calendar
        aria-label="유효하지 않은 날짜"
        defaultValue={today}
        invalid
        size="lg"
        today={today}
      />
      <Calendar aria-label="비활성 날짜" defaultValue={today} disabled size="md" today={today} />
    </div>
  );
}
