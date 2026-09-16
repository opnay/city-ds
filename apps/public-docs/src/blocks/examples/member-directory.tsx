import { useRef, useState } from 'react';
import { Alert } from '@opnay/city-ds-react/alert';
import { AlertDialog } from '@opnay/city-ds-react/alert-dialog';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { Dialog } from '@opnay/city-ds-react/dialog';
import { EmptyState } from '@opnay/city-ds-react/empty-state';
import { Field } from '@opnay/city-ds-react/field';
import { FilterBar } from '@opnay/city-ds-react/filter-bar';
import { Input } from '@opnay/city-ds-react/input';
import { SearchInput } from '@opnay/city-ds-react/search-input';
import { Select } from '@opnay/city-ds-react/select';
import { Skeleton } from '@opnay/city-ds-react/skeleton';
import { Table } from '@opnay/city-ds-react/table';
import { toast } from '@opnay/city-ds-react/toast';
import { BlockCard } from './block-card';
import './blocks.css';

const roles = { admin: '관리자', editor: '편집자', viewer: '뷰어' };
const statuses = { all: '모든 상태', active: '활성', invited: '초대 중' };
export type MemberRole = keyof typeof roles;
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: 'active' | 'invited';
}

type MemberAction = { kind: 'invite' } | { kind: 'role' | 'remove'; member: TeamMember };

function RoleSelect({
  value,
  onChange,
  disabled,
}: {
  value: MemberRole;
  onChange: (value: MemberRole) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <Select.Root
        items={roles}
        value={value}
        disabled={disabled}
        onValueChange={(next) => {
          if (next && next in roles) onChange(next as MemberRole);
        }}
      >
        <Select.Label>역할</Select.Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.List>
                {Object.entries(roles).map(([key, label]) => (
                  <Select.Item key={key} value={key}>
                    <Select.ItemText>{label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export function MemberManagement({
  members,
  currentUserId,
  onInvite,
  onRoleChange,
  onRemove,
  canManage = true,
  loading = false,
  error,
  onRetry,
}: {
  members: readonly TeamMember[];
  currentUserId: string;
  onInvite: (invitation: { email: string; role: MemberRole }) => Promise<void>;
  onRoleChange: (id: string, role: MemberRole) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  canManage?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [action, setAction] = useState<MemberAction | null>(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('viewer');
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [emailError, setEmailError] = useState('');
  const inviteRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);
  const filtered = members.filter(
    (member) =>
      (status === 'all' || member.status === status) &&
      `${member.name} ${member.email}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const reset = () => {
    setQuery('');
    setStatus('all');
  };
  const openAction = (next: MemberAction, trigger: HTMLButtonElement) => {
    returnFocus.current = trigger;
    setActionError('');
    setEmailError('');
    setEmail('');
    setRole(next.kind === 'invite' ? 'viewer' : next.member.role);
    setAction(next);
    setOpen(true);
  };
  const Modal = action?.kind === 'remove' ? AlertDialog : Dialog;
  const target = action && action.kind !== 'invite' ? action.member : undefined;

  return (
    <BlockCard
      title="팀원 관리"
      description="팀원을 초대하고 역할과 팀 접근 권한을 관리해요."
      className="city-block-members"
      actions={
        canManage && (
          <Button
            ref={inviteRef}
            disabled={loading || !!error || busy}
            onClick={(event) => openAction({ kind: 'invite' }, event.currentTarget)}
          >
            초대
          </Button>
        )
      }
    >
      {!canManage && (
        <Alert.Root>
          <Alert.Title level={4}>팀원 관리 권한이 없어요.</Alert.Title>
        </Alert.Root>
      )}
      <div className="city-block-table-controls">
        <FilterBar
          aria-label="팀원 필터"
          className="city-block-result-filters"
          actions={
            <>
              {!loading && !error && (
                <p role="status" className="city-block-status">
                  팀원 {filtered.length}명
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                disabled={!query && status === 'all'}
                onClick={reset}
              >
                초기화
              </Button>
            </>
          }
        >
          <Field.Root>
            <Field.Label className="sr-only">팀원 검색</Field.Label>
            <SearchInput.Root value={query} onValueChange={setQuery}>
              <SearchInput.Group>
                <SearchInput.Input placeholder="이름 또는 이메일 검색" />
                <SearchInput.Clear aria-label="검색어 지우기" />
              </SearchInput.Group>
            </SearchInput.Root>
          </Field.Root>
          <Select.Root
            items={statuses}
            value={status}
            onValueChange={(value) => setStatus(value ?? 'all')}
          >
            <Select.Label className="sr-only">팀원 상태</Select.Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner>
                <Select.Popup>
                  <Select.List aria-label="팀원 상태">
                    {Object.entries(statuses).map(([value, label]) => (
                      <Select.Item key={value} value={value}>
                        <Select.ItemText>{label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </FilterBar>
      </div>
      {loading ? (
        <Skeleton aria-label="팀원 불러오는 중" className="h-40 w-full" />
      ) : error ? (
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>팀원을 불러오지 못했어요.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
          {onRetry && <Button onClick={onRetry}>다시 시도</Button>}
        </Alert.Root>
      ) : (
        <>
          {filtered.length ? (
            <DataTableRegion label="팀원 목록">
              <Table.Root className="city-block-member-table">
                <Table.Header>
                  <Table.Row>
                    <Table.Head>이름</Table.Head>
                    <Table.Head>이메일</Table.Head>
                    <Table.Head>역할</Table.Head>
                    <Table.Head>상태</Table.Head>
                    {canManage && <Table.Head>관리</Table.Head>}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filtered.map((member) => (
                    <Table.Row key={member.id}>
                      <Table.Cell>
                        {member.name} {member.id === currentUserId && <Badge>나</Badge>}
                      </Table.Cell>
                      <Table.Cell>{member.email}</Table.Cell>
                      <Table.Cell>{roles[member.role]}</Table.Cell>
                      <Table.Cell>{statuses[member.status]}</Table.Cell>
                      {canManage && (
                        <Table.Cell>
                          {member.id !== currentUserId && (
                            <div className="city-block-actions">
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={busy}
                                aria-label={`${member.name} 역할 변경`}
                                onClick={(event) =>
                                  openAction({ kind: 'role', member }, event.currentTarget)
                                }
                              >
                                역할 변경
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={busy}
                                aria-label={`${member.name} 내보내기`}
                                onClick={(event) =>
                                  openAction({ kind: 'remove', member }, event.currentTarget)
                                }
                              >
                                내보내기
                              </Button>
                            </div>
                          )}
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </DataTableRegion>
          ) : (
            <EmptyState.Root>
              <EmptyState.Title>
                {members.length ? '일치하는 팀원이 없습니다' : '아직 팀원이 없어요'}
              </EmptyState.Title>
              <EmptyState.Description>
                {members.length
                  ? '검색어나 상태 필터를 변경해 주세요.'
                  : '초대 버튼으로 함께 일할 팀원을 추가해 주세요.'}
              </EmptyState.Description>
              {members.length > 0 && (
                <EmptyState.Actions>
                  <Button variant="outline" onClick={reset}>
                    필터 초기화
                  </Button>
                </EmptyState.Actions>
              )}
            </EmptyState.Root>
          )}
        </>
      )}
      <Modal.Root
        open={open}
        onOpenChange={(open) => {
          if (!open && !inFlight.current) setOpen(false);
        }}
      >
        <Modal.Portal>
          <Modal.Backdrop />
          <Modal.Viewport>
            <Modal.Popup finalFocus={returnFocus}>
              <form
                noValidate
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (!action || inFlight.current || !canManage) return;
                  if (
                    action.kind !== 'invite' &&
                    (action.member.id === currentUserId ||
                      !members.some((member) => member.id === action.member.id))
                  )
                    return;
                  if (action.kind === 'invite') {
                    if (!email.trim() || !emailRef.current?.validity.valid) {
                      setEmailError('올바른 이메일 주소를 입력해 주세요.');
                      emailRef.current?.focus();
                      return;
                    }
                    if (
                      members.some(
                        (member) => member.email.toLowerCase() === email.trim().toLowerCase(),
                      )
                    ) {
                      setEmailError('이미 등록되었거나 초대한 이메일이에요.');
                      emailRef.current?.focus();
                      return;
                    }
                  }
                  inFlight.current = true;
                  setBusy(true);
                  setActionError('');
                  try {
                    if (action.kind === 'invite') {
                      await onInvite({ email: email.trim(), role });
                      toast.success('팀원을 초대했어요.');
                    } else if (action.kind === 'role') {
                      await onRoleChange(action.member.id, role);
                      toast.success('역할을 변경했어요.');
                    } else {
                      await onRemove(action.member.id);
                      returnFocus.current = inviteRef.current;
                      toast.success('팀원을 내보냈어요.');
                    }
                    setOpen(false);
                  } catch {
                    setActionError('변경하지 못했어요. 다시 시도해 주세요.');
                  } finally {
                    inFlight.current = false;
                    setBusy(false);
                  }
                }}
              >
                <Dialog.Header>
                  <div>
                    <Modal.Title>
                      {action?.kind === 'invite'
                        ? '팀원 초대'
                        : action?.kind === 'role'
                          ? '역할 변경'
                          : '팀원을 내보낼까요?'}
                    </Modal.Title>
                    <Modal.Description>
                      {action?.kind === 'invite'
                        ? '이메일과 역할을 입력해 주세요.'
                        : action?.kind === 'role'
                          ? `${target?.name} 님의 팀 접근 권한을 변경해요.`
                          : `${target?.name} 님은 이 팀에 접근할 수 없게 돼요. 다시 참여하려면 초대가 필요해요.`}
                    </Modal.Description>
                  </div>
                </Dialog.Header>
                <Dialog.Body>
                  <div className="city-block-section">
                    {action?.kind === 'invite' && (
                      <Field.Root invalid={!!emailError} disabled={busy}>
                        <Field.Label>이메일</Field.Label>
                        <Input
                          ref={emailRef}
                          type="email"
                          name="email"
                          required
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                            setEmailError('');
                          }}
                        />
                        {emailError && <Field.Error match>{emailError}</Field.Error>}
                      </Field.Root>
                    )}
                    {action?.kind !== 'remove' && (
                      <RoleSelect value={role} onChange={setRole} disabled={busy} />
                    )}
                    {actionError && (
                      <Alert.Root tone="destructive">
                        <Alert.Title>{actionError}</Alert.Title>
                      </Alert.Root>
                    )}
                  </div>
                </Dialog.Body>
                <Dialog.Footer>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => setOpen(false)}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    variant={action?.kind === 'remove' ? 'destructive' : 'primary'}
                    disabled={
                      busy || !canManage || (action?.kind === 'role' && role === target?.role)
                    }
                  >
                    {busy
                      ? '처리 중…'
                      : action?.kind === 'invite'
                        ? '초대'
                        : action?.kind === 'role'
                          ? '저장'
                          : '내보내기'}
                  </Button>
                </Dialog.Footer>
              </form>
            </Modal.Popup>
          </Modal.Viewport>
        </Modal.Portal>
      </Modal.Root>
    </BlockCard>
  );
}

export default function MemberDirectory() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 'seoyeon',
      name: '김서연',
      email: 'seoyeon@example.com',
      role: 'admin',
      status: 'active',
    },
    { id: 'doyun', name: '이도윤', email: 'doyun@example.com', role: 'editor', status: 'active' },
    { id: 'jiwoo', name: '박지우', email: 'jiwoo@example.com', role: 'viewer', status: 'invited' },
  ]);
  return (
    <MemberManagement
      members={members}
      currentUserId="seoyeon"
      onInvite={async ({ email, role }) =>
        setMembers((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            name: email.split('@')[0] ?? email,
            email,
            role,
            status: 'invited',
          },
        ])
      }
      onRoleChange={async (id, role) =>
        setMembers((current) =>
          current.map((member) => (member.id === id ? { ...member, role } : member)),
        )
      }
      onRemove={async (id) => setMembers((current) => current.filter((member) => member.id !== id))}
    />
  );
}
