import { Meter } from '@opnay/city-ds-react/meter';

export default function MeterUsageExample() {
  return (
    <Meter.Root
      format={{ style: 'unit', unit: 'gigabyte', unitDisplay: 'narrow' }}
      locale="en-US"
      max={256}
      value={192}
    >
      <div className="flex justify-between gap-3">
        <Meter.Label>Storage used</Meter.Label>
        <Meter.Value />
      </div>
      <Meter.Track>
        <Meter.Indicator />
      </Meter.Track>
    </Meter.Root>
  );
}
