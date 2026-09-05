import { Meter } from '@opnay/city-ds-react/meter';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function MeterSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <span className="city-docs-example-label">{size}</span>
          <Meter.Root aria-label={`${size} 저장 공간 사용량`} max={256} size={size} value={192}>
            <Meter.Track>
              <Meter.Indicator />
            </Meter.Track>
          </Meter.Root>
        </div>
      ))}
    </div>
  );
}
