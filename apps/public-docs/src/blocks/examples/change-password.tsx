import { useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { Field } from '@opnay/city-ds-react/field';
import { PasswordField, useAccountAction } from './user-management-shared';
import { BlockCard } from './block-card';
import { toast } from '@opnay/city-ds-react/toast';
import './blocks.css';

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  signOutOtherSessions: boolean;
}

export function ChangePassword({
  onChangePassword,
  minLength = 12,
}: {
  onChangePassword: (value: PasswordChange) => Promise<void>;
  minLength?: number;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [signOut, setSignOut] = useState(true);
  const [attempted, setAttempted] = useState(false);
  const action = useAccountAction();
  const nextError =
    next.length < minLength
      ? `${minLength}자 이상 입력하십시오.`
      : next === current
        ? '현재 비밀번호와 다른 비밀번호를 입력하십시오.'
        : '';
  const confirmationError = next !== confirmation ? '새 비밀번호와 일치하지 않습니다.' : '';
  function edit(setter: (value: string) => void, value: string) {
    setter(value);
    action.clearError();
  }

  return (
    <BlockCard
      title="비밀번호 변경"
      description="다른 서비스에서 사용하지 않는 비밀번호를 설정하십시오."
      render={<form noValidate />}
      onSubmit={async (event) => {
        event.preventDefault();
        setAttempted(true);
        if (!current || nextError || confirmationError) return;
        const result = await action.run(() =>
          onChangePassword({
            currentPassword: current,
            newPassword: next,
            signOutOtherSessions: signOut,
          }),
        );
        if (result.ok) {
          setCurrent('');
          setNext('');
          setConfirmation('');
          setAttempted(false);
          toast.success('비밀번호를 변경했습니다.');
        }
      }}
    >
      <PasswordField
        label="현재 비밀번호"
        name="current-password"
        value={current}
        onChange={(value) => edit(setCurrent, value)}
        disabled={action.busy}
        error={attempted && !current ? '현재 비밀번호를 입력하십시오.' : ''}
      />
      <PasswordField
        label="새 비밀번호"
        name="new-password"
        autoComplete="new-password"
        value={next}
        onChange={(value) => edit(setNext, value)}
        disabled={action.busy}
        error={attempted ? nextError : ''}
        description={`${minLength}자 이상 입력하십시오.`}
      />
      <PasswordField
        label="새 비밀번호 확인"
        name="confirm-password"
        autoComplete="new-password"
        value={confirmation}
        onChange={(value) => edit(setConfirmation, value)}
        disabled={action.busy}
        error={attempted ? confirmationError : ''}
      />
      <Field.Root disabled={action.busy}>
        <div className="city-block-check-row">
          <Checkbox checked={signOut} onCheckedChange={setSignOut} />
          <Field.Label className="city-text-supporting">다른 기기에서 로그아웃</Field.Label>
        </div>
        <Field.Description>현재 기기의 로그인은 유지합니다.</Field.Description>
      </Field.Root>
      {action.error && (
        <p className="city-block-error" role="alert">
          {action.error}
        </p>
      )}
      <div className="city-block-actions city-block-actions--separated">
        <Button
          size="lg"
          type="button"
          variant="outline"
          disabled={action.busy || (!current && !next && !confirmation)}
          onClick={() => {
            setCurrent('');
            setNext('');
            setConfirmation('');
            setAttempted(false);
            action.clearError();
          }}
        >
          취소
        </Button>
        <Button size="lg" type="submit" disabled={action.busy}>
          {action.busy ? '변경 중…' : '비밀번호 변경'}
        </Button>
      </div>
    </BlockCard>
  );
}

export default function ChangePasswordExample() {
  return <ChangePassword onChangePassword={async () => {}} />;
}
