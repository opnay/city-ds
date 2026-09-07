import { useState } from 'react';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { AccountActionDialog } from './user-management-shared';
import { BlockCard } from './block-card';
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
  const [notice, setNotice] = useState('');

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
          setNotice('2FA 설정을 완료했습니다.');
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
      <header>
        <h3 className="city-text-subsection-title">2FA 관리</h3>
        <p className="city-block-description city-text-supporting">
          비밀번호 외에 추가 인증으로 계정을 보호합니다.
        </p>
      </header>
      <BlockCard
        title="인증 앱"
        headingLevel={4}
        description={
          registeredAt
            ? `등록일 ${registeredAt}`
            : '인증 앱의 일회용 코드로 로그인 시 본인을 확인합니다.'
        }
        actions={<Badge>{registeredAt ? '사용 중' : '미등록'}</Badge>}
      >
        <div className="city-block-actions">
          {registeredAt ? (
            <Button size="lg" variant="outline" onClick={() => setConfirm('disable')}>
              인증 앱 해제
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={() => {
                setNotice('');
                setSetup(true);
              }}
            >
              인증 앱 등록
            </Button>
          )}
        </div>
      </BlockCard>
      {registeredAt && (
        <BlockCard
          title="복구 코드"
          headingLevel={4}
          description={
            pendingRecovery.length
              ? '등록한 인증 앱은 사용 중입니다. 복구 코드 보관을 마무리하십시오.'
              : '인증 앱에 접근할 수 없을 때 사용합니다. 재발급하면 기존 복구 코드는 사용할 수 없습니다.'
          }
        >
          <div className="city-block-actions">
            {pendingRecovery.length ? (
              <Button size="lg" onClick={() => setSetup(true)}>
                복구 코드 보관 계속
              </Button>
            ) : (
              <Button size="lg" variant="outline" onClick={() => setConfirm('regenerate')}>
                복구 코드 재발급
              </Button>
            )}
          </div>
        </BlockCard>
      )}
      <output className="city-block-status" aria-live="polite">
        {notice}
      </output>
      <AccountActionDialog
        open={confirm !== null}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        requirePassword
        destructive={confirm === 'disable'}
        title={
          confirm === 'disable' ? '인증 앱을 해제하시겠습니까?' : '복구 코드를 재발급하시겠습니까?'
        }
        description={
          confirm === 'disable'
            ? '로그인할 때 인증 앱 코드를 더 이상 요청하지 않습니다. 현재 비밀번호로 본인을 확인하십시오.'
            : '기존 복구 코드는 사용할 수 없게 됩니다. 현재 비밀번호로 본인을 확인하십시오.'
        }
        confirmLabel={confirm === 'disable' ? '인증 앱 해제' : '복구 코드 재발급'}
        onConfirm={async (password) => {
          if (confirm === 'disable') {
            await actions.disableTwoFactor(password);
            setRegisteredAt(undefined);
            setPendingRecovery([]);
            setNotice('인증 앱을 해제했습니다.');
          } else {
            const codes = await actions.regenerateRecoveryCodes(password);
            setPendingRecovery(codes);
            setSetup(true);
            setNotice('');
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
