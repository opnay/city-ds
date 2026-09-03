import { SegmentedControl } from '@opnay/city-ds-react/segmented-control';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function SegmentedControlSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <SegmentedControl aria-label={`${size} 보기`} defaultValue="grid" key={size} size={size}>
          <SegmentedControl.Item value="grid">격자</SegmentedControl.Item>
          <SegmentedControl.Item value="list">목록</SegmentedControl.Item>
        </SegmentedControl>
      ))}
    </div>
  );
}
