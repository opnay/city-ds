import { useEffect, useRef, useState } from 'react';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { Field } from '@opnay/city-ds-react/field';
import { Input } from '@opnay/city-ds-react/input';
import { OtpInput } from '@opnay/city-ds-react/otp-input';
import { BlockCard } from './block-card';
import { toast } from '@opnay/city-ds-react/toast';
import { AccountActionDialog, PasswordField, useAccountAction } from './user-management-shared';
import './blocks.css';

export interface AccountManagementActions {
  requestEmailChange: (email: string, password: string) => Promise<string>;
  confirmEmailChange: (challengeId: string, code: string) => Promise<string>;
  setProviderConnected: (provider: string, connected: boolean) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

export function AccountManagement({
  actions,
  onSignIn,
}: {
  actions: AccountManagementActions;
  onSignIn: () => void;
}) {
  const [email, setEmail] = useState('seoyeon@example.com');
  const [nextEmail, setNextEmail] = useState('');
  const [password, setPassword] = useState('');
  const [challenge, setChallenge] = useState<string>();
  const [code, setCode] = useState('');
  const [editing, setEditing] = useState(false);
  const [providers, setProviders] = useState([
    { name: 'Google', connected: true },
    { name: 'GitHub', connected: false },
  ]);
  const [disconnect, setDisconnect] = useState<string>();
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [errorArea, setErrorArea] = useState<'email' | 'providers' | null>(null);
  const signInButton = useRef<HTMLElement>(null);
  const action = useAccountAction();
  useEffect(() => {
    if (deleted) signInButton.current?.focus();
  }, [deleted]);
  const resetEmail = () => {
    setEditing(false);
    setNextEmail('');
    setPassword('');
    setChallenge(undefined);
    setCode('');
    action.clearError();
    setErrorArea(null);
  };

  if (deleted)
    return (
      <BlockCard
        title="계정이 탈퇴되었습니다"
        description="이 계정으로 더 이상 로그인할 수 없습니다."
      >
        <Button ref={signInButton} onClick={onSignIn}>
          로그인으로 돌아가기
        </Button>
      </BlockCard>
    );

  return (
    <div className="city-block-form">
      <header>
        <h3 className="city-text-subsection-title">계정 관리</h3>
        <p className="city-block-description city-text-supporting">
          로그인 이메일과 연결된 계정을 관리합니다.
        </p>
      </header>
      <BlockCard
        title="로그인 이메일"
        description={
          <span className="city-block-label-row">
            <span>{email}</span>
            <Badge>인증됨</Badge>
          </span>
        }
        titleAs="h4"
        actions={
          !editing ? (
            <Button
              size="lg"
              variant="outline"
              disabled={action.busy}
              onClick={() => {
                setEditing(true);
              }}
            >
              이메일 변경
            </Button>
          ) : undefined
        }
      >
        {editing && (
          <form
            className="city-block-section"
            onSubmit={async (event) => {
              event.preventDefault();
              setErrorArea('email');
              if (challenge) {
                if (code.length !== 6) return;
                const result = await action.run(() => actions.confirmEmailChange(challenge, code));
                if (result.ok) {
                  setEmail(result.value);
                  resetEmail();
                  toast.success('로그인 이메일을 변경했습니다.');
                }
              } else {
                if (
                  !password ||
                  !nextEmail.trim() ||
                  nextEmail.trim().toLowerCase() === email.toLowerCase()
                )
                  return;
                const result = await action.run(() =>
                  actions.requestEmailChange(nextEmail.trim(), password),
                );
                if (result.ok) {
                  setChallenge(result.value);
                  setPassword('');
                }
              }
            }}
          >
            {challenge ? (
              <Field.Root disabled={action.busy}>
                <Field.Label className="city-text-supporting">이메일 확인 코드</Field.Label>
                <OtpInput.Root size="lg" value={code} onValueChange={setCode} />
                <Field.Description>{nextEmail}로 보낸 6자리 코드를 입력하십시오.</Field.Description>
              </Field.Root>
            ) : (
              <>
                <Field.Root disabled={action.busy}>
                  <Field.Label className="city-text-supporting">새 이메일</Field.Label>
                  <Input
                    size="lg"
                    type="email"
                    autoComplete="email"
                    required
                    value={nextEmail}
                    onChange={(event) => setNextEmail(event.target.value)}
                  />
                </Field.Root>
                <PasswordField
                  label="현재 비밀번호"
                  name="email-password"
                  value={password}
                  onChange={setPassword}
                  disabled={action.busy}
                />
              </>
            )}
            <div className="city-block-actions">
              <Button
                size="lg"
                type="button"
                variant="outline"
                disabled={action.busy}
                onClick={resetEmail}
              >
                취소
              </Button>
              <Button
                size="lg"
                type="submit"
                disabled={
                  action.busy ||
                  (challenge
                    ? code.length !== 6
                    : !password ||
                      !nextEmail.trim() ||
                      nextEmail.trim().toLowerCase() === email.toLowerCase())
                }
              >
                {action.busy ? '확인 중…' : challenge ? '이메일 변경 완료' : '확인 코드 보내기'}
              </Button>
            </div>
          </form>
        )}
        {errorArea === 'email' && action.error && (
          <p role="alert" className="city-block-error">
            {action.error}
          </p>
        )}
      </BlockCard>
      <BlockCard
        title="연결 계정"
        description="연결한 계정 또는 비밀번호로 로그인할 수 있습니다."
        titleAs="h4"
      >
        <ul className="city-block-list">
          {providers.map((provider) => (
            <li className="city-block-split" key={provider.name}>
              <div>
                <strong className="city-block-section-title">{provider.name}</strong>
                <p className="city-block-description">
                  {provider.connected ? '연결됨' : '연결되지 않음'}
                </p>
              </div>
              <Button
                size="lg"
                variant="outline"
                disabled={action.busy}
                aria-label={`${provider.name} ${provider.connected ? '연결 해제' : '연결'}`}
                onClick={async () => {
                  if (provider.connected) {
                    setDisconnect(provider.name);
                    return;
                  }
                  setErrorArea('providers');
                  const result = await action.run(() =>
                    actions.setProviderConnected(provider.name, true),
                  );
                  if (result.ok) {
                    setProviders((current) =>
                      current.map((item) =>
                        item.name === provider.name ? { ...item, connected: true } : item,
                      ),
                    );
                    toast.success(`${provider.name} 계정을 연결했습니다.`);
                  }
                }}
              >
                {provider.connected ? '연결 해제' : '연결'}
              </Button>
            </li>
          ))}
        </ul>
        {errorArea === 'providers' && action.error && (
          <p role="alert" className="city-block-error">
            {action.error}
          </p>
        )}
      </BlockCard>
      <BlockCard
        title="계정 탈퇴"
        description="계정과 개인 정보가 삭제됩니다. 탈퇴 후에는 복구할 수 없습니다."
        titleAs="h4"
        actions={
          <Button
            size="lg"
            variant="destructive"
            disabled={action.busy}
            onClick={() => setDeleting(true)}
          >
            계정 탈퇴
          </Button>
        }
      />
      <AccountActionDialog
        destructive
        open={!!disconnect}
        onOpenChange={(open) => {
          if (!open) setDisconnect(undefined);
        }}
        title="연결 계정 해제"
        description={`${disconnect ?? ''} 계정의 로그인 연결을 해제합니다. 비밀번호로 계속 로그인할 수 있습니다.`}
        confirmLabel="연결 해제"
        onConfirm={async () => {
          if (!disconnect) return;
          await actions.setProviderConnected(disconnect, false);
          setProviders((current) =>
            current.map((item) =>
              item.name === disconnect ? { ...item, connected: false } : item,
            ),
          );
          toast.success('로그인 연결을 해제했습니다.');
        }}
      />
      <AccountActionDialog
        open={deleting}
        onOpenChange={setDeleting}
        title="계정을 탈퇴하시겠습니까?"
        description="계정과 개인 정보가 삭제됩니다. 계속하려면 본인을 확인하십시오."
        confirmLabel="계정 탈퇴"
        confirmationText="탈퇴"
        requirePassword
        destructive
        onConfirm={async (value) => {
          await actions.deleteAccount(value);
          toast.success('계정이 탈퇴되었습니다.');
          setDeleted(true);
        }}
      />
    </div>
  );
}

export default function AccountManagementExample() {
  const [signIn, setSignIn] = useState(false);

  if (signIn) return <BlockCard title="로그인" description="계정 탈퇴 뒤 로그인 화면입니다." />;

  return (
    <AccountManagement
      onSignIn={() => setSignIn(true)}
      actions={{
        requestEmailChange: async (email) => email,
        confirmEmailChange: async (email) => email,
        setProviderConnected: async () => {},
        deleteAccount: async () => {},
      }}
    />
  );
}
