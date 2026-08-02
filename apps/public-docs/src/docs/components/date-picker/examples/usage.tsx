import { useState } from 'react';
import { DatePicker } from '@opnay/city-ds-react/date-picker';

const today = new Date(2026, 6, 15);

export default function DatePickerUsageExample() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Date | null>(today);
  return (
    <div className="city-docs-example-stack">
      <DatePicker.Root
        onOpenChange={setOpen}
        onValueChange={setValue}
        open={open}
        size="md"
        value={value}
      >
        <DatePicker.Label>검토 날짜</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
        <DatePicker.Description>직접 입력하거나 달력에서 선택하십시오.</DatePicker.Description>
        <DatePicker.Portal>
          <DatePicker.Positioner>
            <DatePicker.Popup>
              <DatePicker.Calendar aria-label="검토 날짜 달력" today={today} />
            </DatePicker.Popup>
          </DatePicker.Positioner>
        </DatePicker.Portal>
      </DatePicker.Root>
      <DatePicker.Root disabled size="sm">
        <DatePicker.Label>비활성 날짜</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
      </DatePicker.Root>
      <DatePicker.Root readOnly size="lg">
        <DatePicker.Label>읽기 전용 날짜</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
      </DatePicker.Root>
      <DatePicker.Root invalid>
        <DatePicker.Label>유효하지 않은 날짜</DatePicker.Label>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
        <DatePicker.Error>날짜를 확인하십시오.</DatePicker.Error>
      </DatePicker.Root>
    </div>
  );
}
