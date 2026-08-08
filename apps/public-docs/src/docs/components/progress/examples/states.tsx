import { Progress } from '@opnay/city-ds-react/progress';

const shapes = ['linear', 'circular'] as const;
const statuses = ['progressing', 'complete', 'indeterminate'] as const;
const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

const statusValues = {
  progressing: 55,
  complete: 100,
  indeterminate: null,
} as const;

type Shape = (typeof shapes)[number];
type Status = (typeof statuses)[number];
type Size = (typeof sizes)[number];

function Linear({ label, size, value }: { label: string; size: Size; value: number | null }) {
  return (
    <Progress.Root aria-label={label} size={size} value={value}>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
      <Progress.Value />
    </Progress.Root>
  );
}

function ProgressSample({ shape, size, status }: { shape: Shape; size: Size; status: Status }) {
  const combination = `shape=${shape}|status=${status}|size=${size}`;
  const label = `${shape} ${status} ${size}`;
  const value = statusValues[status];

  return (
    <div data-docs-combination={combination}>
      <p>{label}</p>
      {shape === 'linear' ? (
        <Linear label={label} size={size} value={value} />
      ) : (
        <Progress.Circular aria-label={label} size={size} value={value} />
      )}
    </div>
  );
}

export default function ProgressStatesExample() {
  return (
    <div className="city-docs-example-grid">
      {shapes.flatMap((shape) =>
        statuses.flatMap((status) =>
          sizes.map((size) => (
            <ProgressSample
              key={`${shape}-${status}-${size}`}
              shape={shape}
              size={size}
              status={status}
            />
          )),
        ),
      )}
    </div>
  );
}
