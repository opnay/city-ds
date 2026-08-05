import { ToggleGroup } from '@opnay/city-ds-react/toggle-group';

export default function ToggleGroupOrientationExample() {
  return (
    <div className="city-docs-example-row">
      <ToggleGroup aria-label="가로 보기" defaultValue={['grid']} orientation="horizontal">
        <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
        <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup aria-label="세로 보기" defaultValue={['grid']} orientation="vertical">
        <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
        <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
      </ToggleGroup>
    </div>
  );
}
