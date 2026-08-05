import { Calendar } from '@opnay/city-ds-react/calendar';

const today = new Date(2026, 6, 15);

export default function CalendarOutsideDaysExample() {
  return (
    <div className="city-docs-example-grid">
      <Calendar aria-label="인접 월 날짜 표시" showOutsideDays today={today} />
      <Calendar aria-label="인접 월 날짜 숨김" showOutsideDays={false} today={today} />
    </div>
  );
}
