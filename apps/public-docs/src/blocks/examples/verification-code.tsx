import { useState } from 'react';
import { Alert } from '@opnay/city-ds-react/alert';
import { Button } from '@opnay/city-ds-react/button';
import { Field } from '@opnay/city-ds-react/field';
import { OtpInput } from '@opnay/city-ds-react/otp-input';
import './blocks.css';

export default function VerificationCode() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<'idle' | 'error' | 'matched'>('idle');

  return (
    <form
      className="city-block-form city-block-form--compact"
      onSubmit={(event) => {
        event.preventDefault();
        if (code.length !== 6 || result === 'matched') return;
        setResult(code === '123456' ? 'matched' : 'error');
      }}
    >
      <div>
        <h3 className="city-block-title">인증 코드 확인</h3>
        <p className="city-block-description">받은 6자리 코드를 입력하십시오.</p>
      </div>
      <Field.Root invalid={result === 'error'}>
        <Field.Label>인증 코드</Field.Label>
        <OtpInput.Root
          name="code"
          required
          value={code}
          readOnly={result === 'matched'}
          onValueChange={(value) => {
            setCode(value);
            setResult('idle');
          }}
        />
        <Field.Description>미리보기에서는 123456을 사용하십시오.</Field.Description>
        {result === 'error' && (
          <Field.Error match>코드가 일치하지 않습니다. 다시 확인하십시오.</Field.Error>
        )}
      </Field.Root>
      {result === 'matched' && (
        <Alert.Root>
          <Alert.Title>코드가 일치합니다</Alert.Title>
          <Alert.Description>예제 코드 확인을 완료했습니다.</Alert.Description>
        </Alert.Root>
      )}
      <div className="city-block-actions">
        <Button type="submit" disabled={code.length !== 6 || result === 'matched'}>
          코드 확인
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setCode('');
            setResult('idle');
          }}
        >
          다시 입력
        </Button>
      </div>
    </form>
  );
}
