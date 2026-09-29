import { useRef, useState } from 'react';
import { Button, Checkbox, Dialog, Field, Input, SegmentedControl } from '@opnay/city-ds-react';
import { BlockCard } from './block-card';

export type VariableEnvironment = 'staging' | 'production';
export type EnvironmentVariable = { id: string; name: string; environment: VariableEnvironment } & (
  | { secret: true }
  | { secret: false; value: string }
);
export interface EnvironmentVariableDraft {
  id?: string;
  name: string;
  environment: VariableEnvironment;
  secret: boolean;
  value: string;
}
const environmentNames = { staging: '스테이징', production: '운영' };

export function EnvironmentVariables({
  variables,
  onSave,
  onRemove,
  canManage = true,
}: {
  variables: readonly EnvironmentVariable[];
  onSave: (draft: EnvironmentVariableDraft) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  canManage?: boolean;
}) {
  const [environment, setEnvironment] = useState<VariableEnvironment>('staging');
  const [draft, setDraft] = useState<EnvironmentVariableDraft | null>(null);
  const [removing, setRemoving] = useState<EnvironmentVariable | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const pending = useRef(false);
  const addButton = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement>(null);
  const removeButtons = useRef(new Map<string, HTMLElement>());
  const visible = variables.filter((variable) => variable.environment === environment);
  function edit(variable?: EnvironmentVariable) {
    setError('');
    setMessage('');
    setDraft(
      variable
        ? {
            id: variable.id,
            name: variable.name,
            environment: variable.environment,
            secret: variable.secret,
            value: variable.secret ? '' : variable.value,
          }
        : { name: '', value: '', environment, secret: true },
    );
  }
  return (
    <>
      <BlockCard
        title="환경 변수"
        description="변경 사항은 다음 배포부터 적용됩니다."
        className="city-block-project city-block-environment"
        actions={
          <Button
            ref={addButton}
            aria-label="변수 추가"
            disabled={!canManage || busy}
            onClick={(event) => {
              returnFocus.current = event.currentTarget;
              edit();
            }}
          >
            추가
          </Button>
        }
      >
        <SegmentedControl
          className="city-block-env-filter"
          aria-label="변수 환경"
          value={environment}
          disabled={busy}
          onValueChange={(value) => {
            if (value === 'staging' || value === 'production') setEnvironment(value);
          }}
        >
          <SegmentedControl.Item value="staging">스테이징</SegmentedControl.Item>
          <SegmentedControl.Item value="production">운영</SegmentedControl.Item>
        </SegmentedControl>
        {!canManage && <p className="city-block-status">환경 변수를 변경할 권한이 없습니다.</p>}
        <p role="status" className="city-block-status">
          {message}
        </p>
        {!visible.length ? (
          <p className="city-block-status">이 환경에 등록된 변수가 없습니다.</p>
        ) : (
          <ul className="city-block-list">
            {visible.map((variable) => (
              <li key={variable.id} className="city-block-env-row">
                <div className="city-block-section">
                  <div className="city-block-label-row">
                    <code className="city-block-env-name">{variable.name}</code>
                  </div>
                  <code className="city-block-env-value">
                    {variable.secret ? (
                      <>
                        <span aria-hidden="true">••••••••</span>
                        <span className="city-block-sr-only">민감 값 숨김</span>
                      </>
                    ) : (
                      variable.value
                    )}
                  </code>
                </div>
                <div className="city-block-actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!canManage || busy}
                    aria-label={`${variable.name} 수정`}
                    onClick={(event) => {
                      returnFocus.current = event.currentTarget;
                      edit(variable);
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    ref={(node) => {
                      if (node) removeButtons.current.set(variable.id, node);
                      else removeButtons.current.delete(variable.id);
                    }}
                    variant="ghost"
                    size="sm"
                    disabled={!canManage || busy}
                    aria-label={`${variable.name} 삭제`}
                    onClick={(event) => {
                      returnFocus.current = event.currentTarget;
                      setError('');
                      setRemoving(variable);
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </BlockCard>
      <Dialog.Root
        open={draft !== null}
        onOpenChange={(open) => {
          if (!open && !pending.current) {
            setDraft(null);
            setError('');
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="sm" finalFocus={returnFocus}>
              <form
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (!draft || !canManage || pending.current) return;
                  const next = { ...draft, name: draft.name.trim() };
                  if (!/^[A-Z_][A-Z0-9_]*$/.test(next.name)) {
                    setError('이름은 영문 대문자·숫자·밑줄로 입력하고 숫자로 시작하지 마십시오.');
                    return;
                  }
                  if (
                    variables.some(
                      (variable) =>
                        variable.id !== next.id &&
                        variable.environment === next.environment &&
                        variable.name === next.name,
                    )
                  ) {
                    setError('이 환경에 같은 이름의 변수가 있습니다.');
                    return;
                  }
                  if (!next.value) {
                    setError('저장할 값을 입력하십시오.');
                    return;
                  }
                  pending.current = true;
                  setBusy(true);
                  setError('');
                  try {
                    await onSave(next);
                    setDraft(null);
                    setMessage('환경 변수를 저장했습니다.');
                  } catch {
                    setError('저장하지 못했습니다. 입력한 값을 유지합니다. 다시 시도하십시오.');
                  } finally {
                    pending.current = false;
                    setBusy(false);
                  }
                }}
              >
                <Dialog.Header>
                  <Dialog.Title>{draft?.id ? '환경 변수 수정' : '환경 변수 추가'}</Dialog.Title>
                  <Dialog.Description>
                    {draft ? environmentNames[draft.environment] : ''} 환경의 설정 값을
                    입력하십시오.
                  </Dialog.Description>
                </Dialog.Header>
                <div className="city-block-section city-block-dialog-fields">
                  <Field.Root disabled={busy || !canManage}>
                    <Field.Label>변수 이름</Field.Label>
                    <Input
                      required
                      autoComplete="off"
                      value={draft?.name ?? ''}
                      onChange={(event) =>
                        setDraft((current) => current && { ...current, name: event.target.value })
                      }
                    />
                  </Field.Root>
                  <Field.Root disabled={busy || !canManage}>
                    <Field.Label>값</Field.Label>
                    <Input
                      required
                      type={draft?.secret ? 'password' : 'text'}
                      autoComplete="new-password"
                      value={draft?.value ?? ''}
                      onChange={(event) =>
                        setDraft((current) => current && { ...current, value: event.target.value })
                      }
                    />
                    <Field.Description>
                      {draft?.id && draft.secret
                        ? '기존 민감 값은 표시하지 않습니다. 교체할 값을 입력하십시오.'
                        : '이 환경에 적용할 값을 입력하십시오.'}
                    </Field.Description>
                  </Field.Root>
                  <label className="city-block-project-choice">
                    <Checkbox
                      disabled={busy || !canManage}
                      checked={draft?.secret ?? true}
                      onCheckedChange={(secret) =>
                        setDraft((current) => current && { ...current, secret })
                      }
                    />
                    민감 값으로 저장
                  </label>
                  {error && (
                    <p role="alert" className="city-block-project-error">
                      {error}
                    </p>
                  )}
                </div>
                <Dialog.Footer>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => setDraft(null)}
                  >
                    취소
                  </Button>
                  <Button type="submit" disabled={busy || !canManage}>
                    {busy ? '저장 중…' : '변수 저장'}
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root
        open={removing !== null}
        onOpenChange={(open) => {
          if (!open && !pending.current) {
            setRemoving(null);
            setError('');
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="sm" finalFocus={returnFocus}>
              <Dialog.Header>
                <Dialog.Title>환경 변수를 삭제하시겠습니까?</Dialog.Title>
                <Dialog.Description>
                  {removing?.name} 변수는 다음 배포부터 사용할 수 없습니다.
                </Dialog.Description>
              </Dialog.Header>
              {error && (
                <p role="alert" className="city-block-project-error">
                  {error}
                </p>
              )}
              <Dialog.Footer>
                <Button variant="outline" disabled={busy} onClick={() => setRemoving(null)}>
                  취소
                </Button>
                <Button
                  variant="destructive"
                  disabled={busy || !canManage}
                  onClick={async () => {
                    if (!removing || !canManage || pending.current) return;
                    pending.current = true;
                    setBusy(true);
                    setError('');
                    try {
                      await onRemove(removing.id);
                      const removedIndex = visible.findIndex(
                        (variable) => variable.id === removing.id,
                      );
                      const next = visible[removedIndex + 1] ?? visible[removedIndex - 1];
                      returnFocus.current = next
                        ? (removeButtons.current.get(next.id) ?? addButton.current)
                        : addButton.current;
                      setRemoving(null);
                      setMessage('환경 변수를 삭제했습니다.');
                    } catch {
                      setError('삭제하지 못했습니다. 다시 시도하십시오.');
                    } finally {
                      pending.current = false;
                      setBusy(false);
                    }
                  }}
                >
                  {busy ? '삭제 중…' : '변수 삭제'}
                </Button>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
export default function EnvironmentVariablesExample({
  mode = 'edit',
}: { mode?: 'edit' | 'read-only' } = {}) {
  const [variables, setVariables] = useState<EnvironmentVariable[]>([
    {
      id: 'api',
      name: 'API_URL',
      environment: 'staging',
      secret: false,
      value: 'https://api.example.com',
    },
    { id: 'token', name: 'SERVICE_TOKEN', environment: 'staging', secret: true },
    { id: 'prod', name: 'SERVICE_TOKEN', environment: 'production', secret: true },
  ]);
  return (
    <EnvironmentVariables
      canManage={mode !== 'read-only'}
      variables={variables}
      onSave={async (draft) => {
        const common = {
          id: draft.id ?? crypto.randomUUID(),
          name: draft.name,
          environment: draft.environment,
        };
        const record: EnvironmentVariable = draft.secret
          ? { ...common, secret: true }
          : { ...common, secret: false, value: draft.value };
        setVariables((current) => [
          ...current.filter((variable) => variable.id !== record.id),
          record,
        ]);
      }}
      onRemove={async (id) => {
        setVariables((current) => current.filter((variable) => variable.id !== id));
      }}
    />
  );
}
