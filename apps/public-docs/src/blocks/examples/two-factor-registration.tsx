import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { Field } from '@opnay/city-ds-react/field';
import { OtpInput } from '@opnay/city-ds-react/otp-input';
import { PasswordField, useAccountAction } from './user-management-shared';
import { Panel } from '@opnay/city-ds-react/panel';
import { toast } from '@opnay/city-ds-react/toast';
import './blocks.css';

export interface AuthenticatorEnrollment {
  id: string;
  secret: string;
  qrCodeUrl: string;
}
export interface AuthenticatorConfirmation {
  recoveryCodes: string[];
  registeredAt: string;
}
export interface TwoFactorRegistrationProps {
  initialRecoveryCodes?: string[];
  onStart: (password: string) => Promise<AuthenticatorEnrollment>;
  onVerify: (enrollmentId: string, code: string) => Promise<AuthenticatorConfirmation>;
  onCancelEnrollment: (enrollmentId: string) => Promise<void>;
  onActivated: (registeredAt: string) => void;
  onFinish: () => void;
  onDeferRecovery: (codes: string[]) => void;
  onBack: () => void;
}

const steps = ['본인 확인', '앱 연결', '코드 확인', '복구 코드'];

export function TwoFactorRegistration({
  initialRecoveryCodes = [],
  onStart,
  onVerify,
  onCancelEnrollment,
  onActivated,
  onFinish,
  onDeferRecovery,
  onBack,
}: TwoFactorRegistrationProps) {
  const [step, setStep] = useState(initialRecoveryCodes.length ? 3 : 0);
  const [password, setPassword] = useState('');
  const [enrollment, setEnrollment] = useState<AuthenticatorEnrollment>();
  const [code, setCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState(initialRecoveryCodes);
  const [stored, setStored] = useState(false);
  const content = useRef<HTMLElement>(null);
  const headingId = useId();
  const action = useAccountAction();
  useEffect(() => {
    content.current?.focus({ preventScroll: true });
  }, [step]);

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('복사했습니다.');
    } catch {
      toast.error('복사하지 못했습니다. 코드를 직접 선택해 복사하십시오.');
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([recoveryCodes.join('\n')], { type: 'text/plain;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recovery-codes.txt';
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success('복구 코드 파일을 다운로드했습니다.');
  }
  async function leave() {
    if (action.busy) return;
    if (step === 3) {
      onDeferRecovery(recoveryCodes);
      return;
    }
    if (enrollment) {
      const result = await action.run(() => onCancelEnrollment(enrollment.id));
      if (!result.ok) return;
    }
    onBack();
  }

  return (
    <Panel.Root
      className="city-block-form city-block-card"
      aria-label="2차 인증 등록"
      render={<form />}
      onSubmit={async (event) => {
        event.preventDefault();
        if (action.busy) return;
        if (step === 0) {
          if (!password) return;
          const result = await action.run(() => onStart(password));
          if (result.ok) {
            setEnrollment(result.value);
            setPassword('');
            setStep(1);
          }
        } else if (step === 1) {
          setStep(2);
        } else if (step === 2 && enrollment) {
          if (code.length !== 6) return;
          const result = await action.run(() => onVerify(enrollment.id, code));
          if (result.ok) {
            onActivated(result.value.registeredAt);
            setRecoveryCodes(result.value.recoveryCodes);
            setEnrollment(undefined);
            setCode('');
            setStep(3);
          }
        } else if (step === 3 && stored) {
          onFinish();
        }
      }}
    >
      <ol className="city-block-steps" aria-label="2차 인증 등록 단계">
        {steps.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? 'step' : undefined}
            data-complete={index < step ? '' : undefined}
          >
            <span className="city-block-step-number">{index + 1}</span>
            <span id={`${headingId}-${index}`}>{label}</span>
          </li>
        ))}
      </ol>
      <section
        ref={content}
        tabIndex={-1}
        className="city-block-section city-block-step-content"
        aria-labelledby={`${headingId}-${step}`}
      >
        {step === 0 && (
          <>
            <PasswordField
              label="현재 비밀번호"
              name="enrollment-password"
              value={password}
              onChange={setPassword}
              disabled={action.busy}
            />
          </>
        )}
        {step === 1 && enrollment && (
          <>
            <p className="city-block-status">
              인증 앱에서 QR 코드를 스캔하거나 설정 키를 직접 입력하십시오.
            </p>
            <img
              className="city-block-qr"
              src={enrollment.qrCodeUrl}
              alt="인증 앱 연결 QR 코드"
              width={192}
              height={192}
            />
            <div className="city-block-section">
              <span className="city-block-section-title">설정 키</span>
              <code className="city-block-secret">{enrollment.secret}</code>
              <div className="city-block-actions">
                <Button
                  size="lg"
                  type="button"
                  variant="outline"
                  onClick={() => copy(enrollment.secret)}
                >
                  설정 키 복사
                </Button>
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <Field.Root disabled={action.busy} invalid={!!action.error}>
            <Field.Label className="city-text-supporting">인증 코드</Field.Label>
            <OtpInput.Root
              size="lg"
              name="authenticator-code"
              value={code}
              onValueChange={setCode}
            />
            <Field.Description>인증 앱에 표시된 6자리 코드를 입력하십시오.</Field.Description>
          </Field.Root>
        )}
        {step === 3 && (
          <>
            <p className="city-block-status">
              인증 앱을 사용할 수 없을 때 복구 코드로 로그인할 수 있습니다. 각 코드는 한 번만 사용할
              수 있습니다.
            </p>
            <ul className="city-block-recovery-codes" aria-label="복구 코드">
              {recoveryCodes.map((value) => (
                <li key={value}>
                  <code>{value}</code>
                </li>
              ))}
            </ul>
            <div className="city-block-actions">
              <Button
                size="lg"
                type="button"
                variant="outline"
                onClick={() => copy(recoveryCodes.join('\n'))}
              >
                복사
              </Button>
              <Button size="lg" type="button" variant="outline" onClick={download}>
                다운로드
              </Button>
            </div>
            <Field.Root>
              <div className="city-block-check-row">
                <Checkbox checked={stored} onCheckedChange={setStored} />
                <Field.Label className="city-text-supporting">
                  복구 코드를 안전한 곳에 보관했습니다
                </Field.Label>
              </div>
            </Field.Root>
          </>
        )}
      </section>
      {action.error && (
        <p className="city-block-error" role="alert">
          {action.error}
        </p>
      )}
      <div className="city-block-actions city-block-actions--separated">
        {step === 2 && (
          <Button
            size="lg"
            type="button"
            variant="outline"
            disabled={action.busy}
            onClick={() => {
              setStep(1);
              setCode('');
              action.clearError();
            }}
          >
            이전
          </Button>
        )}
        <Button size="lg" type="button" variant="ghost" disabled={action.busy} onClick={leave}>
          {step === 3 ? '나중에 보관' : '등록 취소'}
        </Button>
        <Button
          size="lg"
          type="submit"
          disabled={
            action.busy ||
            (step === 0 && !password) ||
            (step === 2 && code.length !== 6) ||
            (step === 3 && !stored)
          }
        >
          {action.busy ? '확인 중…' : ['다음', '앱 연결 완료', '코드 확인', '등록 마치기'][step]}
        </Button>
      </div>
    </Panel.Root>
  );
}
