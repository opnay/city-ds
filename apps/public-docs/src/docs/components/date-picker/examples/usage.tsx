import { useState } from 'react';
import { DatePicker } from '@opnay/city-ds-react/date-picker';
import { Field } from '@opnay/city-ds-react/field';

const today = new Date(2026, 6, 15);

export default function DatePickerUsageExample() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Date | null>(today);

  return (
    <Field.Root>
      <Field.Label>검토 날짜</Field.Label>
      <DatePicker.Root onOpenChange={setOpen} onValueChange={setValue} open={open} value={value}>
        <DatePicker.Group>
          <DatePicker.Input />
          <DatePicker.Trigger />
        </DatePicker.Group>
        <DatePicker.Portal>
          <DatePicker.Positioner>
            <DatePicker.Popup>
              <DatePicker.Calendar aria-label="검토 날짜 달력" today={today} />
            </DatePicker.Popup>
          </DatePicker.Positioner>
        </DatePicker.Portal>
      </DatePicker.Root>
      <Field.Description>직접 입력하거나 달력에서 선택하십시오.</Field.Description>
    </Field.Root>
  );
}
