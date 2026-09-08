import { useRef, useState } from 'react';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { Dialog } from '@opnay/city-ds-react/dialog';
import { Field } from '@opnay/city-ds-react/field';
import { Input } from '@opnay/city-ds-react/input';
import { BlockCard } from './block-card';
import { AccountActionDialog, useAccountAction } from './user-management-shared';

export interface PasskeyRecord {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt: string;
}

export function PasskeyManagement({
  passkeys,
  onRegister,
  onRename,
  onRemove,
  supported = true,
  canManage = true,
}: {
  passkeys: readonly PasskeyRecord[];
  onRegister: () => Promise<void>;
  onRename: (id: string, name: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  supported?: boolean;
  canManage?: boolean;
}) {
  const action = useAccountAction();
  const [selected, setSelected] = useState<PasskeyRecord | null>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const addButton = useRef<HTMLButtonElement>(null);
  return (
    <BlockCard
      title="패스키 관리"
      description="기기의 화면 잠금으로 비밀번호 없이 로그인합니다."
      actions={
        canManage && (
          <Button
            ref={addButton}
            disabled={!supported || action.busy || renameOpen || removeOpen}
            onClick={async () => {
              setMessage('');
              const result = await action.run(onRegister);
              if (result.ok) setMessage('패스키를 등록했습니다.');
            }}
          >
            {action.busy && !renameOpen ? '등록 중…' : '패스키 추가'}
          </Button>
        )
      }
    >
      {!supported && (
        <p role="status" className="city-block-status">
          이 환경에서는 패스키를 등록할 수 없습니다. 지원되는 기기나 브라우저를 사용하십시오.
        </p>
      )}
      {!canManage && <p className="city-block-status">패스키를 관리할 권한이 없습니다.</p>}
      {!passkeys.length ? (
        <p role="status" className="city-block-status">
          등록한 패스키가 없습니다.
        </p>
      ) : (
        <ul className="city-block-list">
          {passkeys.map((key) => (
            <li key={key.id} className="city-block-section">
              <div className="city-block-label-row">
                <strong className="break-all">{key.name}</strong>
                <Badge appearance="subtle">패스키</Badge>
              </div>
              <p className="city-block-status">
                등록 {key.createdAt} · 최근 사용 {key.lastUsedAt}
              </p>
              {canManage && (
                <div className="city-block-actions">
                  <Button
                    variant="outline"
                    aria-label={`${key.name} 이름 변경`}
                    disabled={action.busy}
                    onClick={() => {
                      setSelected(key);
                      setName(key.name);
                      action.clearError();
                      setRenameOpen(true);
                    }}
                  >
                    이름 변경
                  </Button>
                  <Button
                    variant="ghost"
                    aria-label={`${key.name} 삭제`}
                    disabled={action.busy}
                    onClick={() => {
                      setSelected(key);
                      setRemoveOpen(true);
                    }}
                  >
                    삭제
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {message && (
        <p role="status" className="city-block-status">
          {message}
        </p>
      )}
      {action.error && !renameOpen && (
        <p role="alert" className="city-block-error">
          {action.error} 기기에서 취소했다면 다시 등록할 수 있습니다.
        </p>
      )}
      <Dialog.Root
        open={renameOpen}
        onOpenChange={(open) => {
          if (!action.busy) {
            setRenameOpen(open);
            action.clearError();
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (!selected || !name.trim() || !canManage) return;
                  const result = await action.run(() => onRename(selected.id, name.trim()));
                  if (result.ok) {
                    setRenameOpen(false);
                    setMessage('패스키 이름을 변경했습니다.');
                  }
                }}
              >
                <Dialog.Header>
                  <div>
                    <Dialog.Title>패스키 이름 변경</Dialog.Title>
                    <Dialog.Description>
                      기기를 구분할 수 있는 이름을 입력하십시오.
                    </Dialog.Description>
                  </div>
                </Dialog.Header>
                <Dialog.Body>
                  <Field.Root disabled={action.busy}>
                    <Field.Label>패스키 이름</Field.Label>
                    <Input
                      required
                      maxLength={64}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </Field.Root>
                  {action.error && (
                    <p role="alert" className="city-block-error">
                      {action.error}
                    </p>
                  )}
                </Dialog.Body>
                <Dialog.Footer>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={action.busy}
                    onClick={() => {
                      setRenameOpen(false);
                      action.clearError();
                    }}
                  >
                    취소
                  </Button>
                  <Button type="submit" disabled={action.busy || !name.trim() || !canManage}>
                    {action.busy ? '저장 중…' : '저장'}
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
      <AccountActionDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        title="패스키를 삭제하시겠습니까?"
        description={`${selected?.name ?? ''} 패스키로 더 이상 로그인할 수 없습니다. 다른 로그인 수단이 있는지 확인하십시오.`}
        confirmLabel="패스키 삭제"
        destructive
        onConfirm={async () => {
          if (!selected || !canManage) throw new Error('Unavailable');
          await onRemove(selected.id);
          setMessage('패스키를 삭제했습니다.');
          requestAnimationFrame(() => addButton.current?.focus());
        }}
      />
    </BlockCard>
  );
}

export default function PasskeyManagementExample() {
  const [keys, setKeys] = useState<PasskeyRecord[]>([
    { id: 'mac', name: 'MacBook Pro', createdAt: '2026. 9. 1.', lastUsedAt: '오늘' },
  ]);
  return (
    <PasskeyManagement
      passkeys={keys}
      onRegister={async () =>
        setKeys((current) => [
          ...current,
          { id: crypto.randomUUID(), name: '새 패스키', createdAt: '오늘', lastUsedAt: '사용 전' },
        ])
      }
      onRename={async (id, name) =>
        setKeys((current) => current.map((key) => (key.id === id ? { ...key, name } : key)))
      }
      onRemove={async (id) => setKeys((current) => current.filter((key) => key.id !== id))}
    />
  );
}
