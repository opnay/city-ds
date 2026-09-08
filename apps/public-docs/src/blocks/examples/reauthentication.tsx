import { useEffect, useRef, useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Field } from '@opnay/city-ds-react/field';
import { OtpInput } from '@opnay/city-ds-react/otp-input';
import { BlockCard } from './block-card';
import { PasswordField, useAccountAction } from './user-management-shared';

export type ReauthenticationResult =
  | { status: 'verified' }
  | { status: 'otp-required'; challengeId: string };

export function Reauthentication({
  reason,
  onPassword,
  onCode,
  onContinue,
  onCancel,
}: {
  reason: string;
  onPassword: (password: string) => Promise<ReauthenticationResult>;
  onCode: (challengeId: string, code: string) => Promise<void>;
  onContinue: () => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState<'password' | 'otp' | 'done'>('password');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState('');
  const action = useAccountAction();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  return (
    <BlockCard
      title="본인 확인"
      description={reason}
      render={<form />}
      onSubmit={async (event) => {
        event.preventDefault();
        if (action.busy || step === 'done') return;
        if (step === 'password') {
          if (!password) return;
          const result = await action.run(() => onPassword(password));
          if (result.ok) {
            setPassword('');
            if (result.value.status === 'verified') setStep('done');
            else {
              setChallenge(result.value.challengeId);
              setStep('otp');
            }
          }
        } else {
          if (code.length !== 6) return;
          const result = await action.run(() => onCode(challenge, code));
          if (result.ok) {
            setCode('');
            setChallenge('');
            setStep('done');
          }
        }
      }}
    >
      <h4 ref={heading} tabIndex={-1} className="city-block-step-title">
        {step === 'password' ? '비밀번호 확인' : step === 'otp' ? '2차 인증' : '본인 확인 완료'}
      </h4>
      {step === 'password' && (
        <PasswordField
          label="현재 비밀번호"
          name="reauthentication-password"
          value={password}
          onChange={setPassword}
          disabled={action.busy}
        />
      )}
      {step === 'otp' && (
        <Field.Root disabled={action.busy}>
          <Field.Label>인증 코드</Field.Label>
          <OtpInput.Root value={code} onValueChange={setCode} />
          <Field.Description>인증 앱의 6자리 코드를 입력하십시오.</Field.Description>
        </Field.Root>
      )}
      {step === 'done' && (
        <p role="status" className="city-block-status">
          확인을 마쳤습니다. 진행하던 작업으로 돌아가십시오.
        </p>
      )}
      {action.error && (
        <p role="alert" className="city-block-error">
          {action.error}
        </p>
      )}
      <div className="city-block-actions">
        <Button
          type="button"
          variant="outline"
          disabled={action.busy}
          onClick={() => {
            setPassword('');
            setCode('');
            setChallenge('');
            onCancel();
          }}
        >
          취소
        </Button>
        {step === 'done' ? (
          <Button type="button" onClick={onContinue}>
            작업 계속
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={action.busy || (step === 'password' ? !password : code.length !== 6)}
          >
            {action.busy ? '확인 중…' : '확인'}
          </Button>
        )}
      </div>
    </BlockCard>
  );
}

export default function ReauthenticationExample() {
  const [screen, setScreen] = useState<'start' | 'verify' | 'done'>('start');
  const startButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (screen !== 'verify') startButton.current?.focus();
  }, [screen]);
  if (screen === 'verify')
    return (
      <div className="city-block-form">
        <p className="city-block-status break-words">
          미리보기 비밀번호: preview-password · 인증 코드: 123456
        </p>
        <Reauthentication
          reason="로그인 이메일을 변경하려면 본인 확인이 필요합니다."
          onPassword={async (password) => {
            if (password !== 'preview-password') throw new Error('Invalid password');
            return { status: 'otp-required', challengeId: 'preview' };
          }}
          onCode={async (_id, code) => {
            if (code !== '123456') throw new Error('Invalid code');
          }}
          onContinue={() => setScreen('done')}
          onCancel={() => setScreen('start')}
        />
      </div>
    );
  return (
    <BlockCard
      title={screen === 'done' ? '이메일 변경' : '로그인 이메일'}
      description={
        screen === 'done'
          ? '본인 확인 후 원래 작업으로 돌아왔습니다. 실제 이메일 변경은 소비 앱에서 연결합니다.'
          : 'seoyeon@example.com'
      }
    >
      <Button ref={startButton} onClick={() => setScreen(screen === 'done' ? 'start' : 'verify')}>
        {screen === 'done' ? '다시 체험' : '이메일 변경'}
      </Button>
    </BlockCard>
  );
}
