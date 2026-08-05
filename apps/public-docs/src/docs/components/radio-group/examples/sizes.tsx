import { RadioGroup } from '@opnay/city-ds-react/radio-group';

const sizes = ['sm', 'md', 'lg'] as const;

export default function RadioGroupSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <RadioGroup aria-label={`${size} 공개 범위`} defaultValue="team" key={size} size={size}>
          <RadioGroup.Item value="private">비공개</RadioGroup.Item>
          <RadioGroup.Item value="team">팀</RadioGroup.Item>
        </RadioGroup>
      ))}
    </div>
  );
}
