import { Field } from '@opnay/city-ds-react/field';
import { OtpInput, type OtpInputRootProps } from '@opnay/city-ds-react/otp-input';

type Props = Pick<
  OtpInputRootProps,
  'length' | 'size' | 'mask' | 'readOnly' | 'disabled' | 'validationType'
> & { invalid?: boolean };

export default function OtpInputPlayground({
  length = 6,
  size = 'md',
  mask = false,
  readOnly = false,
  disabled = false,
  invalid = false,
  validationType = 'numeric',
}: Props) {
  return (
    <Field.Root disabled={disabled} invalid={invalid}>
      <Field.Label>인증 코드</Field.Label>
      <OtpInput.Root
        key={`${length}-${validationType}`}
        length={length}
        size={size}
        mask={mask}
        readOnly={readOnly}
        validationType={validationType}
      />
      <Field.Description>
        {length}자리 {validationType === 'numeric' ? '숫자' : '영문·숫자'} 코드를 입력하십시오.
      </Field.Description>
      {invalid && <Field.Error match>코드를 확인하고 다시 입력하십시오.</Field.Error>}
    </Field.Root>
  );
}
