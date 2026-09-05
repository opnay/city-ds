import { Meter, type MeterRange } from '@opnay/city-ds-react/meter';

const controlSizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;
const values = [12, 38, 50, 62, 88] as const;
type MeterSize = (typeof controlSizes)[number];

const customRanges = [
  { from: 0, to: 25, label: '여유', color: 'var(--city-color-success)' },
  { from: 25, to: 50, label: '관찰', color: 'var(--city-color-info)' },
  { from: 50, to: 75, label: '주의', color: 'var(--city-color-warning)' },
  { from: 75, to: 100, label: '긴급', color: 'var(--city-color-destructive)' },
] satisfies readonly MeterRange[];

const reversedRanges = [
  { from: 0, to: 25, label: '개선 필요', color: 'var(--city-color-destructive)' },
  { from: 25, to: 50, label: '관찰', color: 'var(--city-color-warning)' },
  { from: 50, to: 75, label: '양호', color: 'var(--city-color-info)' },
  { from: 75, to: 100, label: '우수', color: 'var(--city-color-success)' },
] satisfies readonly MeterRange[];

const gapRanges = [
  { from: 0, to: 25, label: '낮음', color: 'var(--city-color-info)' },
  { from: 75, to: 100, label: '높음', color: 'var(--city-color-success)' },
] satisfies readonly MeterRange[];

const rangeSets = {
  custom: customRanges,
  reversed: reversedRanges,
  gaps: gapRanges,
} as const;

interface MeterPlaygroundProps {
  ranges?: boolean | string;
  size?: boolean | string;
  value?: boolean | string;
}

function getSize(value: MeterPlaygroundProps['size']): MeterSize {
  return typeof value === 'string' && controlSizes.includes(value as MeterSize)
    ? (value as MeterSize)
    : 'md';
}

function getValue(value: MeterPlaygroundProps['value']) {
  const numericValue = typeof value === 'string' ? Number(value) : Number.NaN;
  return values.includes(numericValue as (typeof values)[number]) ? numericValue : 62;
}

function getRanges(value: MeterPlaygroundProps['ranges']) {
  if (value === 'custom' || value === 'reversed' || value === 'gaps') return rangeSets[value];
  return undefined;
}

export default function MeterPlayground({ ranges, size, value }: MeterPlaygroundProps) {
  const selectedRanges = getRanges(ranges);

  return (
    <Meter.Root
      className="w-full max-w-sm"
      max={100}
      size={getSize(size)}
      value={getValue(value)}
      {...(selectedRanges ? { ranges: selectedRanges } : {})}
    >
      <div className="flex justify-between gap-3">
        <Meter.Label>현재 측정값</Meter.Label>
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
