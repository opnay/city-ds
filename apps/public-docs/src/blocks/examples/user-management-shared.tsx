import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@opnay/city-ds-react/button';
import { Dialog } from '@opnay/city-ds-react/dialog';
import { Field } from '@opnay/city-ds-react/field';
import { Input } from '@opnay/city-ds-react/input';

export function useAccountAction() {
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function run<T>(
    operation: () => Promise<T>,
  ): Promise<{ ok: true; value: T } | { ok: false }> {
    if (lock.current) return { ok: false };
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      return { ok: true, value: await operation() };
    } catch {
      setError('처리하지 못했습니다. 잠시 후 다시 시도하십시오.');
      return { ok: false };
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return { busy, error, run, clearError: () => setError('') };
}

export function PasswordField({
  label,
  name,
  value,
  onChange,
  disabled,
  error,
  description,
  autoComplete = 'current-password',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  description?: string;
  autoComplete?: 'current-password' | 'new-password';
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!value) setVisible(false);
  }, [value]);
  return (
    <Field.Root disabled={disabled} invalid={!!error}>
      <Field.Label className="city-text-supporting">{label}</Field.Label>
      <div className="city-block-password-row">
        <Input
          size="lg"
          name={name}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <Button
          size="lg"
          type="button"
          variant="ghost"
          disabled={disabled}
          aria-label={`${label} ${visible ? '숨기기' : '보기'}`}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        </Button>
      </div>
      {description && !error && <Field.Description>{description}</Field.Description>}
      {error && <Field.Error match>{error}</Field.Error>}
    </Field.Root>
  );
}

export function AccountActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  requirePassword = false,
  confirmationText,
  destructive = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: (password: string) => Promise<void>;
  requirePassword?: boolean;
  confirmationText?: string;
  destructive?: boolean;
}) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const action = useAccountAction();
  useEffect(() => {
    if (!open) {
      setPassword('');
      setConfirmation('');
    }
  }, [open]);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!action.busy) {
          action.clearError();
          onOpenChange(next);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup>
            <form
              className="city-block-section"
              onSubmit={async (event) => {
                event.preventDefault();
                if (
                  (requirePassword && !password) ||
                  (confirmationText && confirmation !== confirmationText)
                )
                  return;
                const result = await action.run(() => onConfirm(password));
                if (result.ok) {
                  action.clearError();
                  onOpenChange(false);
                }
              }}
            >
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>{description}</Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <div className="city-block-section">
                  {requirePassword && (
                    <PasswordField
                      label="현재 비밀번호"
                      name="reauth-password"
                      value={password}
                      onChange={setPassword}
                      disabled={action.busy}
                    />
                  )}
                  {confirmationText && (
                    <Field.Root disabled={action.busy}>
                      <Field.Label>확인 문구</Field.Label>
                      <Input
                        size="lg"
                        value={confirmation}
                        onChange={(event) => setConfirmation(event.target.value)}
                      />
                      <Field.Description>{confirmationText}를 입력하십시오.</Field.Description>
                    </Field.Root>
                  )}
                  {action.error && (
                    <p role="alert" className="city-block-error">
                      {action.error}
                    </p>
                  )}
                </div>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  size="lg"
                  type="button"
                  variant="outline"
                  disabled={action.busy}
                  onClick={() => {
                    action.clearError();
                    onOpenChange(false);
                  }}
                >
                  취소
                </Button>
                <Button
                  size="lg"
                  type="submit"
                  variant={destructive ? 'destructive' : 'primary'}
                  disabled={
                    action.busy ||
                    (requirePassword && !password) ||
                    (!!confirmationText && confirmation !== confirmationText)
                  }
                >
                  {action.busy ? '처리 중…' : confirmLabel}
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
