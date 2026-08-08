import { CheckboxGroup } from '@opnay/city-ds-react/checkbox-group';

const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function CheckboxGroupSizesExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <CheckboxGroup
          aria-label={`${size} 알림 채널`}
          defaultValue={['email']}
          key={size}
          size={size}
        >
          <CheckboxGroup.Item value="email">이메일</CheckboxGroup.Item>
          <CheckboxGroup.Item value="push">푸시</CheckboxGroup.Item>
        </CheckboxGroup>
      ))}
    </div>
  );
}
