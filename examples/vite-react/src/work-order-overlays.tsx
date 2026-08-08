import { useId, useState, type FormEvent } from 'react';
import { CheckCircle2, Clock3, MapPin, UserRound, X } from 'lucide-react';
import { Alert, Badge, Button, Dialog, Drawer, Field, Select } from '@opnay/city-ds-react';

import { CREW_ITEMS, type Crew, type WorkOrder } from './operations-data';

interface WorkOrderDetailsProps {
  onAdvance: (workOrderId: string) => void;
  onAssign: (workOrderId: string, crew: Crew) => void;
  order: WorkOrder | null;
}

function getAdvanceLabel(order: WorkOrder): string | null {
  if (order.status === '배정됨') return '작업 시작';
  if (order.status === '진행 중') return '작업 완료';
  return null;
}

function getCompletionReason(order: WorkOrder): string {
  if (order.crew === null) return '담당팀을 배정해야 완료 처리를 준비할 수 있습니다.';
  if (order.status === '배정됨' || order.status === '대기') {
    return '현장팀이 작업을 시작한 뒤 완료 처리할 수 있습니다.';
  }
  return '현재 작업 상태에서는 완료 처리할 수 없습니다.';
}

export function WorkOrderDetails({ onAdvance, onAssign, order }: WorkOrderDetailsProps) {
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [assignmentDraft, setAssignmentDraft] = useState<Crew | ''>('');
  const [assignmentError, setAssignmentError] = useState(false);
  const advanceReasonId = useId();
  const completionReasonId = useId();

  if (order === null) return null;

  const advanceLabel = getAdvanceLabel(order);
  const canComplete = order.status === '진행 중';

  const resetAssignmentDraft = () => {
    setAssignmentDraft(order.crew ?? '');
    setAssignmentError(false);
  };

  const handleAssignmentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (assignmentDraft === '') {
      setAssignmentError(true);
      return;
    }

    onAssign(order.id, assignmentDraft);
    setAssignmentOpen(false);
    setAssignmentError(false);
  };

  return (
    <Drawer.Portal>
      <Drawer.Backdrop />
      <Drawer.Viewport side="right">
        <Drawer.Popup side="right" size="md">
          <Drawer.Header>
            <div className="city-ops-drawer-heading">
              <div className="city-ops-drawer-title-row">
                <Drawer.Title>{order.title}</Drawer.Title>
                <Badge
                  appearance={order.risk === 'critical' ? 'subtle' : 'outline'}
                  size="sm"
                  tone={order.risk === 'critical' ? 'destructive' : 'neutral'}
                >
                  {order.id}
                </Badge>
              </div>
              <Drawer.Description>
                {order.district} · {order.location} · {order.dueLabel}
              </Drawer.Description>
            </div>
            <Drawer.Close
              aria-label="작업 상세 닫기"
              render={<Button iconOnly size="sm" variant="ghost" />}
            >
              <X aria-hidden="true" size={18} strokeWidth={1.8} />
            </Drawer.Close>
          </Drawer.Header>

          <Drawer.Body className="city-ops-drawer-body">
            {order.blocker ? (
              <Alert.Root tone="warning">
                <Alert.Title level={3}>다음 단계 확인이 필요합니다.</Alert.Title>
                <Alert.Description id={order.status === '대기' ? advanceReasonId : undefined}>
                  {order.blocker}
                </Alert.Description>
              </Alert.Root>
            ) : null}

            <section aria-labelledby="work-summary-heading" className="city-ops-detail-section">
              <h3 id="work-summary-heading">작업 요약</h3>
              <p className="city-ops-detail-description">{order.description}</p>
              <dl className="city-ops-definition-list">
                <div>
                  <dt>
                    <MapPin aria-hidden="true" size={15} strokeWidth={1.8} /> 위치
                  </dt>
                  <dd>{order.location}</dd>
                </div>
                <div>
                  <dt>
                    <UserRound aria-hidden="true" size={15} strokeWidth={1.8} /> 담당팀
                  </dt>
                  <dd>{order.crew ?? '미배정'}</dd>
                </div>
                <div>
                  <dt>
                    <Clock3 aria-hidden="true" size={15} strokeWidth={1.8} /> SLA
                  </dt>
                  <dd>{order.dueLabel}</dd>
                </div>
                <div>
                  <dt>상태</dt>
                  <dd>{order.status}</dd>
                </div>
              </dl>
            </section>

            <section aria-labelledby="activity-heading" className="city-ops-detail-section">
              <h3 id="activity-heading">최근 활동</h3>
              <ol className="city-ops-activity-list">
                {order.activities.map((activity) => (
                  <li key={`${activity.at}-${activity.description}`}>
                    <time>{activity.at}</time>
                    <span>{activity.description}</span>
                  </li>
                ))}
              </ol>
            </section>

            {!canComplete && order.status !== '완료' ? (
              <section aria-labelledby="completion-heading" className="city-ops-detail-section">
                <h3 id="completion-heading">완료 처리</h3>
                <Button
                  aria-describedby={completionReasonId}
                  disabled
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  작업 완료
                </Button>
                <p className="city-ops-disabled-reason" id={completionReasonId}>
                  {getCompletionReason(order)}
                </p>
              </section>
            ) : null}

            {order.status === '완료' ? (
              <Alert.Root tone="success">
                <Alert.Title level={3}>작업이 완료되었습니다.</Alert.Title>
                <Alert.Description>
                  최근 활동에서 완료 시각과 처리 내용을 확인할 수 있습니다.
                </Alert.Description>
              </Alert.Root>
            ) : null}
          </Drawer.Body>

          <Drawer.Footer className="city-ops-drawer-footer">
            <Drawer.Close render={<Button variant="outline" />}>닫기</Drawer.Close>

            {order.status !== '완료' ? (
              <Dialog.Root
                open={assignmentOpen}
                onOpenChange={(nextOpen, details) => {
                  if (!nextOpen && details.reason === 'escape-key') {
                    resetAssignmentDraft();
                  }
                  setAssignmentOpen(nextOpen);
                }}
              >
                <Dialog.Trigger
                  onClick={resetAssignmentDraft}
                  render={<Button variant={order.crew === null ? 'primary' : 'outline'} />}
                >
                  {order.crew === null ? '담당팀 배정' : '담당팀 변경'}
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Backdrop />
                  <Dialog.Viewport>
                    <Dialog.Popup size="sm">
                      <Dialog.Title>담당팀 {order.crew === null ? '배정' : '변경'}</Dialog.Title>
                      <Dialog.Description>
                        {order.id} 작업을 처리할 현장팀을 선택하십시오.
                      </Dialog.Description>
                      <form className="city-ops-assignment-form" onSubmit={handleAssignmentSubmit}>
                        <Field.Root invalid={assignmentError}>
                          <Field.Label>담당팀</Field.Label>
                          <Select.Root
                            items={CREW_ITEMS}
                            onValueChange={(value) => {
                              setAssignmentDraft((value as Crew | null) ?? '');
                              setAssignmentError(false);
                            }}
                            value={assignmentDraft || null}
                          >
                            <Select.Trigger className="city-ops-field-control">
                              <Select.Value placeholder="담당팀 선택" />
                              <Select.Icon />
                            </Select.Trigger>
                            <Select.Portal>
                              <Select.Positioner sideOffset={6}>
                                <Select.Popup>
                                  <Select.List>
                                    {Object.entries(CREW_ITEMS).map(([value, label]) => (
                                      <Select.Item key={value} value={value}>
                                        <Select.ItemIndicator />
                                        <Select.ItemText>{label}</Select.ItemText>
                                      </Select.Item>
                                    ))}
                                  </Select.List>
                                </Select.Popup>
                              </Select.Positioner>
                            </Select.Portal>
                          </Select.Root>
                          <Field.Description>
                            작업 위치와 현재 대응 범위를 확인한 뒤 배정하십시오.
                          </Field.Description>
                          <Field.Error match={assignmentError}>
                            담당팀을 선택해야 배정을 저장할 수 있습니다.
                          </Field.Error>
                        </Field.Root>
                        <div className="city-ops-dialog-actions">
                          <Dialog.Close
                            onClick={resetAssignmentDraft}
                            render={<Button variant="outline" />}
                          >
                            취소
                          </Dialog.Close>
                          <Button type="submit">배정 저장</Button>
                        </div>
                      </form>
                    </Dialog.Popup>
                  </Dialog.Viewport>
                </Dialog.Portal>
              </Dialog.Root>
            ) : null}

            {advanceLabel ? (
              <Button onClick={() => onAdvance(order.id)} type="button">
                {order.status === '진행 중' ? (
                  <CheckCircle2 aria-hidden="true" size={16} strokeWidth={1.8} />
                ) : null}
                {advanceLabel}
              </Button>
            ) : order.status === '대기' ? (
              <Button aria-describedby={advanceReasonId} disabled type="button">
                작업 시작
              </Button>
            ) : null}
          </Drawer.Footer>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  );
}
