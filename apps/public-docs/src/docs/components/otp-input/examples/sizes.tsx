import { Field } from '@opnay/city-ds-react/field';
import { OtpInput } from '@opnay/city-ds-react/otp-input';

export default function SizesExample() {
  return (
    <div className="city-docs-example-stack">
      {(['xsm', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
        <Field.Root key={size}>
          <Field.Label>{size} 인증 코드</Field.Label>
          <OtpInput.Root size={size} defaultValue="123" />
        </Field.Root>
      ))}
    </div>
  );
}
