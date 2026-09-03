import { ToggleGroup } from '@opnay/city-ds-react/toggle-group';

export default function ToggleGroupOrientationExample() {
  return (
    <div className="city-docs-example-row">
      <ToggleGroup
        aria-label="가로 서식 도구"
        defaultValue={['bold']}
        multiple
        orientation="horizontal"
      >
        <ToggleGroup.Item value="bold">굵게</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">기울임</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup
        aria-label="세로 서식 도구"
        defaultValue={['bold']}
        multiple
        orientation="vertical"
      >
        <ToggleGroup.Item value="bold">굵게</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">기울임</ToggleGroup.Item>
      </ToggleGroup>
    </div>
  );
}
