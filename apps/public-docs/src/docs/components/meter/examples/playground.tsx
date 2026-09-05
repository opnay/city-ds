import { Meter } from '@opnay/city-ds-react/meter';
import { CONTROL_SIZES } from '@opnay/city-ds-react';

export default function MeterPlayground({ size }: { size?: string | boolean }) {
  const resolvedSize = CONTROL_SIZES.find((value) => value === size) ?? 'md';
  return (
    <Meter.Root className="w-full max-w-sm" max={256} size={resolvedSize} value={192}>
      <div className="flex justify-between gap-3">
        <Meter.Label>저장 공간 사용량</Meter.Label>
        <Meter.Value />
      </div>
      <Meter.Track>
        <Meter.Indicator />
      </Meter.Track>
    </Meter.Root>
  );
}
