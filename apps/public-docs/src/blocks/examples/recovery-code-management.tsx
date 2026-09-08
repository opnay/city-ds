import { useRef, useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { Field } from '@opnay/city-ds-react/field';
import { BlockCard } from './block-card';
import { AccountActionDialog, useAccountAction } from './user-management-shared';

export function RecoveryCodeManagement({
  remainingCount,
  onGenerate,
}: {
  remainingCount: number;
  onGenerate: (password: string) => Promise<readonly string[]>;
}) {
  const [open, setOpen] = useState(false);
  const [codes, setCodes] = useState<readonly string[]>([]);
  const [stored, setStored] = useState(false);
  const [message, setMessage] = useState('');
  const action = useAccountAction();
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <BlockCard
      title="복구 코드 관리"
      description="인증 앱을 사용할 수 없을 때 일회용 복구 코드로 로그인할 수 있습니다."
    >
      {codes.length ? (
        <>
          <p className="city-block-status">
            이 화면을 닫으면 코드를 다시 볼 수 없습니다. 안전한 곳에 보관하십시오.
          </p>
          <ul aria-label="새 복구 코드" className="city-block-recovery-codes">
            {codes.map((code) => (
              <li key={code}>
                <code className="break-all">{code}</code>
              </li>
            ))}
          </ul>
          <div className="city-block-actions">
            <Button
              variant="outline"
              disabled={action.busy}
              onClick={async () => {
                const result = await action.run(() =>
                  navigator.clipboard.writeText(codes.join('\n')),
                );
                if (result.ok) setMessage('복구 코드를 복사했습니다.');
              }}
            >
              복사
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const url = URL.createObjectURL(
                  new Blob([codes.join('\n')], { type: 'text/plain;charset=utf-8' }),
                );
                const link = document.createElement('a');
                link.href = url;
                link.download = 'recovery-codes.txt';
                document.body.append(link);
                link.click();
                link.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                setMessage('복구 코드 다운로드를 시작했습니다.');
              }}
            >
              다운로드
            </Button>
          </div>
          <Field.Root>
            <div className="city-block-check-row">
              <Checkbox checked={stored} onCheckedChange={setStored} />
              <Field.Label>복구 코드를 안전한 곳에 보관했습니다</Field.Label>
            </div>
          </Field.Root>
          <div className="city-block-actions">
            <Button
              disabled={!stored || action.busy}
              onClick={() => {
                setCodes([]);
                setStored(false);
                action.clearError();
                setMessage('복구 코드 보관을 완료했습니다.');
                requestAnimationFrame(() => trigger.current?.focus());
              }}
            >
              보관 완료
            </Button>
          </div>
        </>
      ) : (
        <>
          <p role="status">사용 가능한 코드 {remainingCount}개</p>
          <p className="city-block-status">
            새로 발급하면 기존 코드는 모두 무효화됩니다. 사용한 코드는 다시 사용할 수 없습니다.
          </p>
          <div className="city-block-actions">
            <Button
              ref={trigger}
              onClick={() => {
                setMessage('');
                setOpen(true);
              }}
            >
              {remainingCount ? '복구 코드 재발급' : '복구 코드 발급'}
            </Button>
          </div>
        </>
      )}
      {message && (
        <p role="status" className="city-block-status">
          {message}
        </p>
      )}
      {action.error && (
        <p role="alert" className="city-block-error">
          복사하지 못했습니다. 코드를 직접 선택하거나 다운로드하십시오.
        </p>
      )}
      <AccountActionDialog
        open={open}
        onOpenChange={setOpen}
        title="복구 코드를 발급하시겠습니까?"
        description="기존 복구 코드는 즉시 무효화됩니다. 현재 비밀번호로 본인을 확인하십시오."
        confirmLabel="새 코드 발급"
        requirePassword
        destructive
        onConfirm={async (password) => {
          const next = await onGenerate(password);
          if (!next.length) throw new Error('No recovery codes');
          setCodes(next);
          setStored(false);
          action.clearError();
        }}
      />
    </BlockCard>
  );
}

export default function RecoveryCodeManagementExample() {
  const [remaining, setRemaining] = useState(6);
  return (
    <div className="city-block-form">
      <p className="city-block-status break-words">미리보기 비밀번호: preview-password</p>
      <RecoveryCodeManagement
        remainingCount={remaining}
        onGenerate={async (password) => {
          if (password !== 'preview-password') throw new Error('Invalid password');
          const codes = Array.from(
            { length: 8 },
            () => `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          );
          setRemaining(codes.length);
          return codes;
        }}
      />
    </div>
  );
}
