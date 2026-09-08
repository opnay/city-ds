import { useRef, useState } from 'react';
import { Alert } from '@opnay/city-ds-react/alert';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { Dialog } from '@opnay/city-ds-react/dialog';
import { Field } from '@opnay/city-ds-react/field';
import { Input } from '@opnay/city-ds-react/input';
import { EmptyState } from '@opnay/city-ds-react/empty-state';
import { Skeleton } from '@opnay/city-ds-react/skeleton';
import { toast } from '@opnay/city-ds-react/toast';
import { BlockCard } from './block-card';
import './blocks.css';

export interface PaymentMethod {
  id: string;
  name: string;
  lastFour: string;
  expiry: string;
  isDefault: boolean;
}

export interface CardRegistration {
  name: string;
  number: string;
  expiry: string;
}

export const exampleMethods: readonly PaymentMethod[] = [
  { id: 'card-1', name: '신한카드', lastFour: '1234', expiry: '2028.09', isDefault: true },
  { id: 'card-2', name: '현대카드', lastFour: '5678', expiry: '2029.03', isDefault: false },
];

export function PaymentMethods({
  methods,
  loading = false,
  canManage = true,
  onAdd,
  onSetDefault,
  onRemove,
}: {
  methods: readonly PaymentMethod[];
  loading?: boolean;
  canManage?: boolean;
  onAdd: (card: CardRegistration) => Promise<void>;
  onSetDefault: (id: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [target, setTarget] = useState<PaymentMethod | null>(null);
  const [registering, setRegistering] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const addRef = useRef<HTMLButtonElement>(null);
  async function run(action: () => Promise<void>, message: string) {
    if (lock.current || loading || !canManage) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      await action();
      setTarget(null);
      setRegistering(false);
      toast.success(message);
    } catch {
      setError('변경하지 못했어요. 다시 시도해 주세요.');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const feedback = error && (
    <Alert.Root tone="destructive">
      <Alert.Title level={4}>{error}</Alert.Title>
    </Alert.Root>
  );
  return (
    <BlockCard
      className="city-block-billing"
      title="결제 수단 관리"
      description="기본 결제 수단으로 구독 요금을 결제해요."
    >
      {!canManage && (
        <Alert.Root>
          <Alert.Title level={4}>관리자만 결제 수단을 변경할 수 있어요.</Alert.Title>
        </Alert.Root>
      )}
      {loading ? (
        <div aria-label="결제 수단 불러오는 중" aria-busy="true" className="city-block-section">
          <Skeleton className="h-24 w-full" />
        </div>
      ) : methods.length === 0 ? (
        <EmptyState.Root>
          <EmptyState.Title>등록한 결제 수단이 없어요.</EmptyState.Title>
          <EmptyState.Description>구독 요금을 결제할 카드를 추가해 주세요.</EmptyState.Description>
        </EmptyState.Root>
      ) : (
        <ul className="city-block-list">
          {methods.map((method) => (
            <li key={method.id} className="city-block-payment-method">
              <div className="city-block-section">
                <div className="city-block-label-row">
                  <h4 className="city-text-body font-semibold">
                    {method.name} · {method.lastFour}
                  </h4>
                  {method.isDefault && <Badge>기본</Badge>}
                </div>
                <p className="city-text-supporting text-city-muted-foreground">
                  유효기간 {method.expiry}
                </p>
              </div>
              <div className="city-block-actions">
                {!method.isDefault && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busy || !canManage}
                      aria-label={`${method.name} ${method.lastFour} 기본으로 설정`}
                      onClick={() =>
                        void run(() => onSetDefault(method.id), '기본 결제 수단을 바꿨어요.')
                      }
                    >
                      기본으로 설정
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busy || !canManage}
                      aria-label={`${method.name} ${method.lastFour} 삭제`}
                      onClick={() => {
                        setError('');
                        setTarget(method);
                      }}
                    >
                      삭제
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {!target && !registering && feedback}
      <div className="city-block-actions">
        <Button
          ref={addRef}
          type="button"
          disabled={busy || loading || !canManage}
          onClick={() => {
            setError('');
            setRegistering(true);
          }}
        >
          {busy && !target ? '처리 중…' : '카드 추가'}
        </Button>
      </div>
      <Dialog.Root
        open={registering}
        onOpenChange={(open) => {
          if (!busy) {
            setRegistering(open);
            setError('');
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="sm" finalFocus={addRef}>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  const value = (name: string) => {
                    const field = data.get(name);
                    return typeof field === 'string' ? field : '';
                  };
                  const card = {
                    name: value('cardName').trim(),
                    number: value('cardNumber').replace(/\s/g, ''),
                    expiry: value('cardExpiry'),
                  };
                  if (!card.name || !/^\d{13,19}$/.test(card.number)) {
                    setError('카드 이름과 번호를 확인해 주세요.');
                    return;
                  }
                  const [month, year] = card.expiry.split('/').map(Number);
                  if (
                    !month ||
                    !year ||
                    month > 12 ||
                    new Date(2000 + year, month, 1) <= new Date()
                  ) {
                    setError('유효기간을 확인해 주세요.');
                    return;
                  }
                  void run(() => onAdd(card), '결제 수단을 추가했어요.');
                }}
              >
                <Dialog.Header>
                  <Dialog.Title>카드 추가</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body className="city-block-section">
                  <Dialog.Description>카드 정보를 입력하고 등록해 주세요.</Dialog.Description>
                  <Field.Root name="cardName">
                    <Field.Label>카드 이름</Field.Label>
                    <Input
                      name="cardName"
                      required
                      pattern=".*\S.*"
                      placeholder="예: 신한카드"
                      disabled={busy}
                    />
                  </Field.Root>
                  <Field.Root name="cardNumber">
                    <Field.Label>카드 번호</Field.Label>
                    <Input
                      name="cardNumber"
                      required
                      inputMode="numeric"
                      autoComplete="cc-number"
                      pattern="[0-9 ]{13,23}"
                      placeholder="4242 4242 4242 4242"
                      disabled={busy}
                    />
                  </Field.Root>
                  <Field.Root name="cardExpiry">
                    <Field.Label>유효기간</Field.Label>
                    <Input
                      name="cardExpiry"
                      required
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      pattern="(0[1-9]|1[0-2])/[0-9]{2}"
                      placeholder="MM/YY"
                      disabled={busy}
                    />
                  </Field.Root>
                  {feedback}
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.Close render={<Button type="button" variant="outline" disabled={busy} />}>
                    닫기
                  </Dialog.Close>
                  <Button type="submit" disabled={busy || !canManage}>
                    {busy ? '등록 중…' : '등록'}
                  </Button>
                </Dialog.Footer>
              </form>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
      {methods.length > 0 && (
        <p className="city-text-supporting text-city-muted-foreground">
          기본 카드를 삭제하려면 다른 카드를 기본으로 설정해 주세요.
        </p>
      )}
      <Dialog.Root
        open={!!target}
        onOpenChange={(open) => {
          if (!open && !busy) {
            setTarget(null);
            setError('');
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="sm" finalFocus={addRef}>
              <Dialog.Header>
                <Dialog.Title>이 카드를 삭제할까요?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body className="city-block-section">
                <Dialog.Description>
                  {target?.name} · {target?.lastFour} 카드를 목록에서 삭제해요. 다시 사용하려면
                  등록해야 해요.
                </Dialog.Description>
                {feedback}
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button variant="outline" disabled={busy} />}>
                  닫기
                </Dialog.Close>
                <Button
                  variant="destructive"
                  disabled={busy || !canManage}
                  onClick={() => {
                    if (target && !methods.find((method) => method.id === target.id)?.isDefault)
                      void run(() => onRemove(target.id), '결제 수단을 삭제했어요.');
                  }}
                >
                  {busy ? '삭제 중…' : '삭제'}
                </Button>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </BlockCard>
  );
}

type Scenario = 'default' | 'empty' | 'loading' | 'error' | 'read-only';
export default function PaymentMethodsExample({ scenario = 'default' }: { scenario?: Scenario }) {
  return <PaymentMethodsScenario key={scenario} scenario={scenario} />;
}
function PaymentMethodsScenario({ scenario }: { scenario: Scenario }) {
  const [methods, setMethods] = useState<readonly PaymentMethod[]>(
    scenario === 'empty' ? [] : exampleMethods,
  );
  const nextId = useRef(3);
  function checkError() {
    if (scenario === 'error') throw new Error('Example failure');
  }
  return (
    <PaymentMethods
      methods={methods}
      loading={scenario === 'loading'}
      canManage={scenario !== 'read-only'}
      onAdd={async (card) => {
        checkError();
        const id = nextId.current++;
        setMethods((current) => [
          ...current,
          {
            id: `card-${id}`,
            name: card.name,
            lastFour: card.number.slice(-4),
            expiry: `20${card.expiry.slice(3)}.${card.expiry.slice(0, 2)}`,
            isDefault: current.length === 0,
          },
        ]);
      }}
      onSetDefault={async (id) => {
        checkError();
        setMethods((current) =>
          current.map((method) => ({ ...method, isDefault: method.id === id })),
        );
      }}
      onRemove={async (id) => {
        checkError();
        setMethods((current) => current.filter((method) => method.id !== id));
      }}
    />
  );
}
