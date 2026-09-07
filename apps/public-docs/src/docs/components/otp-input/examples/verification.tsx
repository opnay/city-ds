import { useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Field } from '@opnay/city-ds-react/field';
import { OtpInput } from '@opnay/city-ds-react/otp-input';

export default function VerificationExample() {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="city-docs-example-stack"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <Field.Root>
        <Field.Label>이메일 인증 코드</Field.Label>
        <OtpInput.Root
          name="code"
          required
          value={value}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            setSubmitted(false);
          }}
        />
        <Field.Description>메일로 받은 6자리 숫자를 입력하십시오.</Field.Description>
      </Field.Root>
      <div className="city-docs-example-row">
        <Button type="submit" disabled={value.length !== 6}>
          입력 확인
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setValue('');
            setSubmitted(false);
          }}
        >
          다시 입력
        </Button>
      </div>
      <output aria-live="polite">
        {submitted ? '6자리 코드가 입력되었습니다.' : '입력 후 확인 버튼을 누르십시오.'}
      </output>
    </form>
  );
}
