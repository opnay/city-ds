import { Field } from '@opnay/city-ds-react/field';
import { OtpInput } from '@opnay/city-ds-react/otp-input';

export default function GroupedExample() {
  return (
    <Field.Root>
      <Field.Label>복구 코드</Field.Label>
      <OtpInput.Root
        length={6}
        validationType="alphanumeric"
        normalizeValue={(value) => value.toUpperCase()}
      >
        <OtpInput.Input />
        <OtpInput.Input />
        <OtpInput.Input />
        <span aria-hidden="true">–</span>
        <OtpInput.Input />
        <OtpInput.Input />
        <OtpInput.Input />
      </OtpInput.Root>
      <Field.Description>
        영문과 숫자를 입력하십시오. 구분 기호는 코드에 포함되지 않습니다.
      </Field.Description>
    </Field.Root>
  );
}
