import { useState } from 'react';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { AccountActionDialog } from './user-management-shared';
import { BlockCard } from './block-card';
import { toast } from '@opnay/city-ds-react/toast';
import {
  TwoFactorRegistration,
  type AuthenticatorConfirmation,
  type AuthenticatorEnrollment,
} from './two-factor-registration';
import authenticatorQr from './authenticator-qr.svg';
import './blocks.css';

export interface TwoFactorActions {
  startEnrollment: (password: string) => Promise<AuthenticatorEnrollment>;
  verifyEnrollment: (id: string, code: string) => Promise<AuthenticatorConfirmation>;
  cancelEnrollment: (id: string) => Promise<void>;
  regenerateRecoveryCodes: (password: string) => Promise<string[]>;
  disableTwoFactor: (password: string) => Promise<void>;
}

export function TwoFactorManagement({
  actions,
  initialRegisteredAt,
}: {
  actions: TwoFactorActions;
  initialRegisteredAt?: string;
}) {
  const [registeredAt, setRegisteredAt] = useState(initialRegisteredAt);
  const [setup, setSetup] = useState(false);
  const [pendingRecovery, setPendingRecovery] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<'regenerate' | 'disable' | null>(null);
  const [completionMessage, setCompletionMessage] = useState('2차 인증 설정을 완료했습니다.');

  if (setup)
    return (
      <TwoFactorRegistration
        initialRecoveryCodes={pendingRecovery}
        onStart={actions.startEnrollment}
        onVerify={actions.verifyEnrollment}
        onCancelEnrollment={actions.cancelEnrollment}
        onActivated={setRegisteredAt}
        onFinish={() => {
          setPendingRecovery([]);
          setSetup(false);
          toast.success(completionMessage);
        }}
        onDeferRecovery={(codes) => {
          setPendingRecovery(codes);
          setSetup(false);
        }}
        onBack={() => setSetup(false)}
      />
    );

  return (
    <div className="city-block-form">
      <BlockCard
        title="2차 인증"
        titleAs="span"
        description={
          <span className="city-block-label-row">
            <span>
              {registeredAt
                ? `등록일 ${registeredAt}`
                : '로그인 시 인증 앱의 코드를 추가로 확인합니다.'}
            </span>
            {registeredAt && <Badge>사용 중</Badge>}
          </span>
        }
        actions={
          registeredAt ? (
            <Button size="lg" variant="outline" onClick={() => setConfirm('disable')}>
              인증 앱 해제
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => {
                setCompletionMessage('2차 인증 설정을 완료했습니다.');
                setSetup(true);
              }}
            >
              인증 앱 등록
            </Button>
          )
        }
      />
      {registeredAt && (
        <BlockCard
          title="복구 코드"
          titleAs="h4"
          description={
            pendingRecovery.length
              ? '아직 보관을 마치지 않았습니다.'
              : '인증 앱에 접근할 수 없을 때 사용합니다. 재발급하면 기존 코드는 사용할 수 없습니다.'
          }
          actions={
            pendingRecovery.length ? (
              <Button size="lg" onClick={() => setSetup(true)}>
                보관 계속
              </Button>
            ) : (
              <Button size="lg" variant="outline" onClick={() => setConfirm('regenerate')}>
                재발급
              </Button>
            )
          }
        />
      )}
      <AccountActionDialog
        open={confirm !== null}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        requirePassword
        destructive
        title={
          confirm === 'disable' ? '인증 앱을 해제하시겠습니까?' : '복구 코드를 재발급하시겠습니까?'
        }
        description={
          confirm === 'disable'
            ? '로그인할 때 인증 앱 코드를 더 이상 요청하지 않습니다. 현재 비밀번호로 본인을 확인하십시오.'
            : '기존 복구 코드는 사용할 수 없게 됩니다. 현재 비밀번호로 본인을 확인하십시오.'
        }
        confirmLabel={confirm === 'disable' ? '인증 앱 해제' : '재발급'}
        onConfirm={async (password) => {
          if (confirm === 'disable') {
            await actions.disableTwoFactor(password);
            setRegisteredAt(undefined);
            setPendingRecovery([]);
            toast.success('인증 앱을 해제했습니다.');
          } else {
            const codes = await actions.regenerateRecoveryCodes(password);
            setPendingRecovery(codes);
            setSetup(true);
            setCompletionMessage('복구 코드를 재발급했습니다.');
          }
        }}
      />
    </div>
  );
}

const makeRecoveryCodes = () =>
  Array.from({ length: 8 }, () => crypto.randomUUID().slice(0, 8).toUpperCase());

export default function TwoFactorManagementExample() {
  return (
    <TwoFactorManagement
      actions={{
        startEnrollment: async () => ({
          id: 'preview-enrollment',
          secret: 'JBSWY3DPEHPK3PXP',
          qrCodeUrl: authenticatorQr,
        }),
        verifyEnrollment: async () => ({
          recoveryCodes: makeRecoveryCodes(),
          registeredAt: new Date().toLocaleDateString('ko-KR'),
        }),
        cancelEnrollment: async () => {},
        regenerateRecoveryCodes: async () => makeRecoveryCodes(),
        disableTwoFactor: async () => {},
      }}
    />
  );
}
