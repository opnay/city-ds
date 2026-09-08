import { useRef, useState } from 'react';
import { Alert } from '@opnay/city-ds-react/alert';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { Dialog } from '@opnay/city-ds-react/dialog';
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
  onAdd: () => Promise<void>;
  onSetDefault: (id: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [target, setTarget] = useState<PaymentMethod | null>(null);
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
      {!target && feedback}
      <div className="city-block-actions">
        <Button
          ref={addRef}
          type="button"
          disabled={busy || loading || !canManage}
          onClick={() => void run(onAdd, '결제 수단을 추가했어요.')}
        >
          {busy && !target ? '처리 중…' : '카드 추가'}
        </Button>
      </div>
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
      onAdd={async () => {
        checkError();
        const id = nextId.current++;
        setMethods((current) => [
          ...current,
          {
            id: `card-${id}`,
            name: '예제 카드',
            lastFour: String(id).padStart(4, '0'),
            expiry: '2029.12',
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
