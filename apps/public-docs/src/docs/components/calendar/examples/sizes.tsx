import { Calendar } from '@opnay/city-ds-react/calendar';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;
const today = new Date(2026, 6, 15);

export default function CalendarSizesExample() {
  return (
    <div className="city-docs-example-grid">
      {sizes.map((size) => (
        <Calendar
          aria-label={`${size} 날짜`}
          defaultValue={today}
          key={size}
          size={size}
          today={today}
        />
      ))}
    </div>
  );
}
