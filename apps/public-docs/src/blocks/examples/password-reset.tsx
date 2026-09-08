import { useEffect, useRef, useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Field } from '@opnay/city-ds-react/field';
import { Input } from '@opnay/city-ds-react/input';
import { OtpInput } from '@opnay/city-ds-react/otp-input';
import { BlockCard } from './block-card';
import { PasswordField, useAccountAction } from './user-management-shared';

export interface PasswordResetActions {
  request: (email: string) => Promise<string>;
  verify: (challengeId: string, code: string) => Promise<string>;
  reset: (resetToken: string, password: string) => Promise<void>;
}

export function PasswordReset({
  actions,
  onSignIn,
  minLength = 12,
}: {
  actions: PasswordResetActions;
  onSignIn: () => void;
  minLength?: number;
}) {
  const [step, setStep] = useState<'request' | 'verify' | 'password' | 'done'>('request');
  const [email, setEmail] = useState('');
  const [challenge, setChallenge] = useState('');
  const [token, setToken] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [attempted, setAttempted] = useState(false);
  const action = useAccountAction();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  const passwordError = password.length < minLength ? `${minLength}자 이상 입력하십시오.` : '';
  const titles = {
    request: '계정 확인',
    verify: '인증 코드 확인',
    password: '새 비밀번호 설정',
    done: '비밀번호를 재설정했습니다',
  };
  function restart() {
    setStep('request');
    setCode('');
    setChallenge('');
    setToken('');
    setPassword('');
    setConfirmation('');
    setAttempted(false);
    action.clearError();
  }
  return (
    <BlockCard
      title="비밀번호 재설정"
      description="계정을 확인한 뒤 새 비밀번호를 설정하십시오."
      render={<form noValidate />}
      onSubmit={async (event) => {
        event.preventDefault();
        if (action.busy || step === 'done') return;
        setAttempted(true);
        if (step === 'request') {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
          const result = await action.run(() => actions.request(email.trim()));
          if (result.ok) {
            setChallenge(result.value);
            setStep('verify');
            setAttempted(false);
          }
        } else if (step === 'verify') {
          if (code.length !== 6) return;
          const result = await action.run(() => actions.verify(challenge, code));
          if (result.ok) {
            setToken(result.value);
            setCode('');
            setChallenge('');
            setStep('password');
            setAttempted(false);
          }
        } else {
          if (passwordError || password !== confirmation) return;
          const result = await action.run(() => actions.reset(token, password));
          if (result.ok) {
            setToken('');
            setPassword('');
            setConfirmation('');
            setStep('done');
          }
        }
      }}
    >
      <h4 ref={heading} tabIndex={-1} className="city-block-step-title">
        {titles[step]}
      </h4>
      {step === 'request' && (
        <Field.Root
          disabled={action.busy}
          invalid={attempted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())}
        >
          <Field.Label>이메일</Field.Label>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Field.Description>가입할 때 사용한 이메일을 입력하십시오.</Field.Description>
          {attempted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
            <Field.Error match>올바른 이메일을 입력하십시오.</Field.Error>
          )}
        </Field.Root>
      )}
      {step === 'verify' && (
        <>
          <p className="city-block-status">
            일치하는 계정이 있으면 인증 코드를 보냈습니다. 받은 편지함과 스팸함을 확인하십시오.
          </p>
          <Field.Root disabled={action.busy} invalid={attempted && code.length !== 6}>
            <Field.Label>인증 코드</Field.Label>
            <OtpInput.Root value={code} onValueChange={setCode} />
            {attempted && code.length !== 6 && (
              <Field.Error match>6자리 코드를 입력하십시오.</Field.Error>
            )}
          </Field.Root>
        </>
      )}
      {step === 'password' && (
        <>
          <PasswordField
            label="새 비밀번호"
            name="reset-password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            disabled={action.busy}
            error={attempted ? passwordError : ''}
            description={`${minLength}자 이상 입력하십시오.`}
          />
          <PasswordField
            label="새 비밀번호 확인"
            name="reset-confirmation"
            autoComplete="new-password"
            value={confirmation}
            onChange={setConfirmation}
            disabled={action.busy}
            error={attempted && confirmation !== password ? '새 비밀번호와 일치하지 않습니다.' : ''}
          />
        </>
      )}
      {step === 'done' && (
        <p role="status" className="city-block-status">
          새 비밀번호로 다시 로그인하십시오.
        </p>
      )}
      {action.error && (
        <p role="alert" className="city-block-error">
          {action.error} 코드가 만료되었다면 처음부터 다시 요청하십시오.
        </p>
      )}
      <div className="city-block-actions">
        {step !== 'request' && step !== 'done' && (
          <Button type="button" variant="outline" disabled={action.busy} onClick={restart}>
            처음부터
          </Button>
        )}
        {step === 'done' ? (
          <Button type="button" onClick={onSignIn}>
            로그인으로 돌아가기
          </Button>
        ) : (
          <Button type="submit" disabled={action.busy}>
            {action.busy
              ? '처리 중…'
              : step === 'request'
                ? '재설정 코드 요청'
                : step === 'verify'
                  ? '코드 확인'
                  : '비밀번호 재설정'}
          </Button>
        )}
      </div>
    </BlockCard>
  );
}

export default function PasswordResetExample() {
  const [finished, setFinished] = useState(false);
  return finished ? (
    <BlockCard title="로그인" description="미리보기의 로그인 복귀 화면입니다.">
      <Button onClick={() => setFinished(false)}>재설정 다시 체험</Button>
    </BlockCard>
  ) : (
    <div className="city-block-form">
      <p className="city-block-status break-words">미리보기 인증 코드: 123456</p>
      <PasswordReset
        onSignIn={() => setFinished(true)}
        actions={{
          request: async () => 'preview-challenge',
          verify: async (_id, code) => {
            if (code !== '123456') throw new Error('Invalid code');
            return 'preview-reset-token';
          },
          reset: async () => {},
        }}
      />
    </div>
  );
}
