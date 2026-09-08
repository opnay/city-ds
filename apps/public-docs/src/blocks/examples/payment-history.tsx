import { useState } from 'react';
import { Alert } from '@opnay/city-ds-react/alert';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { EmptyState } from '@opnay/city-ds-react/empty-state';
import { Skeleton } from '@opnay/city-ds-react/skeleton';
import { ScrollArea } from '@opnay/city-ds-react/scroll-area';
import { Table } from '@opnay/city-ds-react/table';
import { BlockCard } from './block-card';
import './blocks.css';

export interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  amount: string;
  method: string;
  status: 'paid' | 'failed' | 'refunded';
}

const statusLabels = { paid: '결제 완료', failed: '결제 실패', refunded: '환불 완료' };

export const examplePayments: readonly PaymentRecord[] = [
  {
    id: 'payment-3',
    date: '2026-09-08',
    description: 'PRO · 월간',
    amount: '29,000원',
    method: '신한카드 · 1234',
    status: 'paid',
  },
  {
    id: 'payment-2',
    date: '2026-09-08',
    description: 'PRO · 월간',
    amount: '29,000원',
    method: '신한카드 · 1234',
    status: 'failed',
  },
  {
    id: 'payment-1',
    date: '2026-08-08',
    description: 'PRO · 월간',
    amount: '29,000원',
    method: '신한카드 · 1234',
    status: 'refunded',
  },
];

export function PaymentHistory({
  records,
  loading = false,
  error,
  onRetry,
}: {
  records: readonly PaymentRecord[];
  loading?: boolean;
  error?: string | undefined;
  onRetry?: () => void;
}) {
  return (
    <BlockCard title="결제 기록" className="city-block-billing">
      {loading ? (
        <div aria-label="결제 기록 불러오는 중" aria-busy="true" className="city-block-section">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : error ? (
        <Alert.Root tone="destructive">
          <Alert.Title render={<h4 />}>결제 기록을 불러오지 못했어요.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
          {onRetry && (
            <Button type="button" variant="outline" onClick={onRetry}>
              다시 불러오기
            </Button>
          )}
        </Alert.Root>
      ) : records.length === 0 ? (
        <EmptyState.Root>
          <EmptyState.Title>결제 기록이 없어요.</EmptyState.Title>
          <EmptyState.Description>첫 결제를 마치면 여기에 표시돼요.</EmptyState.Description>
        </EmptyState.Root>
      ) : (
        <DataTableRegion label="결제 기록 목록" scrollAreaClassName="overflow-x-hidden">
          <ScrollArea.Root>
            <ScrollArea.Viewport className="pb-3">
              <ScrollArea.Content>
                <Table.Root className="city-block-payment-table">
                  <Table.Header>
                    <Table.Row>
                      <Table.Head>결제일</Table.Head>
                      <Table.Head>내역</Table.Head>
                      <Table.Head className="text-right">금액</Table.Head>
                      <Table.Head>결제 수단</Table.Head>
                      <Table.Head>상태</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {records.map((record) => (
                      <Table.Row key={record.id}>
                        <Table.Cell>
                          <time dateTime={record.date}>{record.date}</time>
                        </Table.Cell>
                        <Table.Cell>{record.description}</Table.Cell>
                        <Table.Cell className="text-right tabular-nums">{record.amount}</Table.Cell>
                        <Table.Cell>{record.method}</Table.Cell>
                        <Table.Cell>
                          <Badge
                            tone={record.status === 'failed' ? 'destructive' : 'neutral'}
                            appearance="subtle"
                          >
                            {statusLabels[record.status]}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="horizontal" className="opacity-100">
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </DataTableRegion>
      )}
    </BlockCard>
  );
}

type Scenario = 'default' | 'loading' | 'empty' | 'error';

export default function PaymentHistoryExample({ scenario = 'default' }: { scenario?: Scenario }) {
  return <PaymentHistoryScenario key={scenario} scenario={scenario} />;
}

function PaymentHistoryScenario({ scenario }: { scenario: Scenario }) {
  const [recovered, setRecovered] = useState(false);
  return (
    <PaymentHistory
      records={scenario === 'empty' ? [] : examplePayments}
      loading={scenario === 'loading'}
      error={scenario === 'error' && !recovered ? '잠시 후 다시 시도해 주세요.' : undefined}
      onRetry={() => setRecovered(true)}
    />
  );
}
