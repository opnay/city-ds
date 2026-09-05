import { Meter, type MeterRange } from '@opnay/city-ds-react/meter';

const highIsRisk = [
  { from: 0, to: 25, label: '여유', color: 'var(--city-color-success)' },
  { from: 25, to: 50, label: '관찰', color: 'var(--city-color-info)' },
  { from: 50, to: 75, label: '주의', color: 'var(--city-color-warning)' },
  { from: 75, to: 100, label: '긴급', color: 'var(--city-color-destructive)' },
] satisfies readonly MeterRange[];

const highIsGood = [
  { from: 0, to: 25, label: '개선 필요', color: 'var(--city-color-destructive)' },
  { from: 25, to: 50, label: '관찰', color: 'var(--city-color-warning)' },
  { from: 50, to: 75, label: '양호', color: 'var(--city-color-info)' },
  { from: 75, to: 100, label: '우수', color: 'var(--city-color-success)' },
] satisfies readonly MeterRange[];

const rangesWithGap = [
  { from: 0, to: 25, label: '낮음', color: 'var(--city-color-info)' },
  { from: 75, to: 100, label: '높음', color: 'var(--city-color-success)' },
] satisfies readonly MeterRange[];

function RangeMeter({
  label,
  ranges,
  value,
}: {
  label: string;
  ranges?: readonly MeterRange[];
  value: number;
}) {
  return (
    <Meter.Root aria-label={label} max={100} value={value} {...(ranges ? { ranges } : {})}>
      <div className="flex justify-between gap-3">
        <span>{label}</span>
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

export default function MeterRangesExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">4단계 · 높을수록 위험</span>
        <RangeMeter label="변경 실패율" ranges={highIsRisk} value={62} />
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">4단계 · 높을수록 양호</span>
        <RangeMeter label="서비스 상태 점수" ranges={highIsGood} value={88} />
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">범위 없음 · 기본 색상</span>
        <RangeMeter label="할당량 사용량" value={62} />
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">범위 사이 공백 · 기본 색상, 레이블 없음</span>
        <RangeMeter label="검토 점수" ranges={rangesWithGap} value={50} />
      </div>
    </div>
  );
}
