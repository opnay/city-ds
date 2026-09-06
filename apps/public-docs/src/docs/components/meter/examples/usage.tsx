import { Meter, type MeterRange } from '@opnay/city-ds-react/meter';

const capacityRanges = [
  { from: 0, to: 128, label: '여유', color: 'var(--city-color-success)' },
  { from: 128, to: 192, label: '관찰', color: 'var(--city-color-warning)' },
  { from: 192, to: 256, label: '부족', color: 'var(--city-color-destructive)' },
] satisfies readonly MeterRange[];

export default function MeterUsageExample() {
  return (
    <Meter.Root
      format={{ style: 'unit', unit: 'gigabyte', unitDisplay: 'narrow' }}
      locale="en-US"
      max={256}
      ranges={capacityRanges}
      value={192}
    >
      <div className="flex justify-between gap-3">
        <Meter.Label>Storage used</Meter.Label>
        <div className="flex items-baseline gap-2">
          <Meter.RangeLabel />
          <Meter.Value />
        </div>
      </div>
      <Meter.Track>
        <Meter.Indicator />
      </Meter.Track>
    </Meter.Root>
  );
}
