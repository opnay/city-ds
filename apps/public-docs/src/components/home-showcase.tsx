import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { useMemo, useState } from 'react';
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock3,
  Command,
  FileText,
  Laptop,
  LockKeyhole,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Upload,
  UserPlus,
} from 'lucide-react';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { Calendar } from '@opnay/city-ds-react/calendar';
import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { Field } from '@opnay/city-ds-react/field';
import { FileUpload } from '@opnay/city-ds-react/file-upload';
import { Input, InputGroup } from '@opnay/city-ds-react/input';
import { SearchInput } from '@opnay/city-ds-react/search-input';
import { Select } from '@opnay/city-ds-react/select';
import { Switch } from '@opnay/city-ds-react/switch';
import { Table, type TableSortDirection } from '@opnay/city-ds-react/table';
import { Tabs } from '@opnay/city-ds-react/tabs';
import { toast } from '@opnay/city-ds-react/toast';

interface ShowcaseCardProps {
  className?: string;
  children: React.ReactNode;
  description: string;
  icon: React.ComponentType<{ 'aria-hidden'?: boolean; size?: number }>;
  title: string;
}

const AVATARS = {
  arjun: '/avatars/arjun-mehta.webp',
  maya: '/avatars/maya-chen.webp',
  noah: '/avatars/noah-williams.webp',
  riley: '/avatars/riley-brooks.webp',
} as const;

const ORDER_FILTERS = {
  all: 'Any status',
  cancelled: 'Cancelled',
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
};

const ORDERS = [
  {
    customer: 'Acme Corp',
    id: 'ORD-98421',
    status: 'Processing',
    total: 1842.5,
    updated: '9:12 AM',
  },
  {
    customer: 'Northwind Traders',
    id: 'ORD-98420',
    status: 'Shipped',
    total: 3217,
    updated: '8:47 AM',
  },
  {
    customer: 'Globo Chemicals',
    id: 'ORD-98419',
    status: 'Pending',
    total: 980,
    updated: 'Yesterday',
  },
  {
    customer: 'Initech',
    id: 'ORD-98418',
    status: 'Processing',
    total: 2150,
    updated: 'Yesterday',
  },
  {
    customer: 'Stark Industries',
    id: 'ORD-98417',
    status: 'Cancelled',
    total: 675,
    updated: 'Aug 4',
  },
] as const;

const ISSUES = {
  all: [
    ['Avatar upload stalls at 99%', '#2417 · Bug · High', 'Maya Chen', AVATARS.maya],
    ['Checkout fails for saved cards', '#2413 · Bug · High', 'Noah Williams', AVATARS.noah],
    ['Reports export missing columns', '#2409 · Bug · Medium', 'Arjun Mehta', AVATARS.arjun],
    ['Email notifications delayed', '#2406 · Bug · Medium', 'Riley Brooks', AVATARS.riley],
  ],
  mine: [
    ['Reports export missing columns', '#2409 · Bug · Medium', 'Arjun Mehta', AVATARS.arjun],
    ['Mobile drawer traps focus', '#2398 · Accessibility', 'Arjun Mehta', AVATARS.arjun],
  ],
  unassigned: [
    ['Avatar upload stalls at 99%', '#2417 · Bug · High', 'Maya Chen', AVATARS.maya],
    ['Email notifications delayed', '#2406 · Bug · Medium', 'Riley Brooks', AVATARS.riley],
    ['Audit log needs export', '#2392 · Feature', 'Noah Williams', AVATARS.noah],
    ['Checkout fails for saved cards', '#2413 · Bug · High', 'Noah Williams', AVATARS.noah],
    ['Mobile app crashes on launch', '#2401 · Bug · High', 'Arjun Mehta', AVATARS.arjun],
  ],
} as const;

const COMMANDS = [
  { hint: '⌘1', label: 'Open orders', path: '/patterns' },
  { hint: '⌘2', label: 'Find components', path: '/components' },
  { hint: '⌘3', label: 'Read foundations', path: '/foundations' },
  { hint: '⌘4', label: 'Accessibility guide', path: '/accessibility' },
] as const;

const ACTIVITY = [
  {
    avatar: AVATARS.maya,
    detail: 'Changed priority from Medium to High',
    name: 'Maya Chen',
    time: '2h ago',
    title: 'updated issue #2417',
  },
  {
    avatar: AVATARS.arjun,
    detail: 'Fix: payment validation on checkout',
    name: 'Arjun Mehta',
    time: '5h ago',
    title: 'closed issue #2405',
  },
  {
    avatar: AVATARS.riley,
    detail: 'Please check the export columns again.',
    name: 'Riley Brooks',
    time: '1d ago',
    title: 'commented on issue #2409',
  },
  {
    avatar: AVATARS.noah,
    detail: 'bug',
    name: 'Noah Williams',
    time: '1d ago',
    title: 'added a label to issue #2413',
  },
] as const;

function ShowcaseCard({ children, className, description, icon: Icon, title }: ShowcaseCardProps) {
  return (
    <article className={`city-showcase-card ${className ?? ''}`}>
      <header className="city-showcase-card-header">
        <div>
          <span className="city-showcase-card-icon" aria-hidden="true">
            <Icon size={15} />
          </span>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
      </header>
      <div className="city-showcase-card-body">{children}</div>
    </article>
  );
}

function Avatar({ alt, src }: { alt: string; src: string }) {
  return <img alt={alt} className="city-showcase-avatar" height={28} src={src} width={28} />;
}

function OrdersCard() {
  const [status, setStatus] = useState('all');
  const [direction, setDirection] = useState<TableSortDirection | false>(false);
  const [selected, setSelected] = useState<string[]>(['ORD-98420']);
  const rows = useMemo(() => {
    const filtered =
      status === 'all' ? ORDERS : ORDERS.filter((row) => row.status.toLowerCase() === status);
    if (!direction) return filtered;
    return [...filtered].sort((left, right) => {
      const result = left.id.localeCompare(right.id);
      return direction === 'asc' ? result : -result;
    });
  }, [direction, status]);
  const selectedInView = rows.filter((row) => selected.includes(row.id)).length;
  const selectionState =
    selectedInView === rows.length && rows.length > 0
      ? true
      : selectedInView > 0
        ? 'indeterminate'
        : false;

  const setRowSelected = (id: string, checked: boolean) => {
    setSelected((current) =>
      checked ? [...new Set([...current, id])] : current.filter((item) => item !== id),
    );
  };

  return (
    <ShowcaseCard
      className="city-showcase-orders"
      description="8,432 total"
      icon={ShoppingBag}
      title="Orders"
    >
      <div className="city-showcase-toolbar">
        <Select.Root
          items={ORDER_FILTERS}
          onValueChange={(value) => setStatus(value ?? 'all')}
          size="sm"
          value={status}
        >
          <Select.Label className="city-docs-sr-only">Order status</Select.Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={5}>
              <Select.Popup>
                <Select.List>
                  {Object.entries(ORDER_FILTERS).map(([value, label]) => (
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
        <span aria-live="polite">{selected.length} selected</span>
      </div>
      <DataTableRegion label="Scrollable orders" appearance="plain">
        <Table.Root aria-label="Orders" className="city-showcase-orders-table" size="sm">
          <Table.Header>
            <Table.Row>
              <Table.SelectionHead
                checked={selectionState}
                label="Select visible orders"
                onCheckedChange={(checked) =>
                  setSelected((current) => {
                    const visible = rows.map((row) => row.id);
                    return checked
                      ? [...new Set([...current, ...visible])]
                      : current.filter((id) => !visible.includes(id as (typeof visible)[number]));
                  })
                }
              />
              <Table.Head
                aria-sort={
                  direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'
                }
              >
                <Table.SortButton direction={direction} onDirectionChange={setDirection}>
                  Order
                </Table.SortButton>
              </Table.Head>
              <Table.Head>Customer</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Total</Table.Head>
              <Table.Head>Updated</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.id}>
                <Table.SelectionCell
                  checked={selected.includes(row.id)}
                  label={`Select ${row.id}`}
                  onCheckedChange={(checked) => setRowSelected(row.id, checked)}
                />
                <Table.Cell>
                  <strong>{row.id}</strong>
                </Table.Cell>
                <Table.Cell>{row.customer}</Table.Cell>
                <Table.Cell>
                  <Badge
                    appearance="subtle"
                    tone={
                      row.status === 'Shipped'
                        ? 'success'
                        : row.status === 'Cancelled'
                          ? 'neutral'
                          : 'warning'
                    }
                  >
                    {row.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  ${row.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </Table.Cell>
                <Table.Cell>{row.updated}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </DataTableRegion>
    </ShowcaseCard>
  );
}

function IssueTriageCard() {
  return (
    <ShowcaseCard
      className="city-showcase-issues"
      description="Open issues requiring attention"
      icon={CircleDot}
      title="Issue triage"
    >
      <Tabs.Root defaultValue="unassigned" density="compact">
        <Tabs.List aria-label="Issue assignment">
          <Tabs.Tab value="unassigned">Unassigned</Tabs.Tab>
          <Tabs.Tab value="mine">Mine</Tabs.Tab>
          <Tabs.Tab value="all">All</Tabs.Tab>
        </Tabs.List>
        {Object.entries(ISSUES).map(([value, issues]) => (
          <Tabs.Panel key={value} value={value}>
            <ul className="city-showcase-issue-list">
              {issues.map(([title, meta, owner, avatar]) => (
                <li key={title}>
                  <Avatar alt={`${owner} profile`} src={avatar} />
                  <span>
                    <strong>{title}</strong>
                    <small>{meta}</small>
                  </span>
                </li>
              ))}
            </ul>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </ShowcaseCard>
  );
}

function CheckoutCard() {
  const [complete, setComplete] = useState(false);

  const placeOrder = () => {
    setComplete(true);
    toast.success('Order placed', {
      description: 'Confirmation AC-20984 is ready.',
    });
  };

  return (
    <ShowcaseCard
      className="city-showcase-checkout"
      description={complete ? 'Order AC-20984 confirmed' : 'Review and place the order'}
      icon={LockKeyhole}
      title="Checkout"
    >
      <ol className="city-showcase-steps">
        <li data-complete="true">
          <CheckCircle2 aria-hidden="true" size={18} />
          <span>
            <strong>Delivery</strong>
            <small>Alex Morgan · New York, NY</small>
          </span>
        </li>
        <li data-complete="true">
          <CheckCircle2 aria-hidden="true" size={18} />
          <span>
            <strong>Payment</strong>
            <small>Visa ending in 4242</small>
          </span>
        </li>
        <li data-complete={complete ? 'true' : 'false'}>
          {complete ? (
            <PackageCheck aria-hidden="true" size={18} />
          ) : (
            <span className="city-showcase-step-number">3</span>
          )}
          <span>
            <strong>{complete ? 'Confirmation' : 'Review'}</strong>
            <small>{complete ? 'Receipt sent by email' : '$4,124.50 · 3 items'}</small>
          </span>
        </li>
      </ol>
      <Button onClick={placeOrder} size="sm" type="button" variant="primary">
        {complete ? 'Place another order' : 'Place order'}
      </Button>
    </ShowcaseCard>
  );
}

function ScheduleCard() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 7, 6));
  const [time, setTime] = useState('10:30 AM');
  const [confirmed, setConfirmed] = useState('');
  const times = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'];

  return (
    <ShowcaseCard
      className="city-showcase-schedule"
      description="Choose a delivery window"
      icon={CalendarDays}
      title="Schedule delivery"
    >
      <div className="city-showcase-schedule-grid">
        <Calendar
          aria-label="Delivery date"
          defaultMonth={new Date(2026, 7, 1)}
          onValueChange={setDate}
          size="sm"
          today={new Date(2026, 7, 6)}
          value={date}
        />
        <div>
          <strong>
            {date
              ? date.toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  weekday: 'short',
                })
              : 'Select a date'}
          </strong>
          <div className="city-showcase-time-grid" aria-label="Delivery time">
            {times.map((item) => (
              <Button
                aria-pressed={time === item}
                key={item}
                onClick={() => setTime(item)}
                size="sm"
                type="button"
                variant={time === item ? 'primary' : 'outline'}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="city-showcase-card-action">
        <span aria-live="polite">{confirmed}</span>
        <Button
          disabled={!date}
          onClick={() =>
            setConfirmed(`Confirmed for ${date?.toLocaleDateString('en-US')} at ${time}`)
          }
          size="sm"
          type="button"
          variant="primary"
        >
          Confirm
        </Button>
      </div>
    </ShowcaseCard>
  );
}

function InviteMembersCard() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('member');
  const [sendEmail, setSendEmail] = useState(true);
  const [members, setMembers] = useState<string[]>(['sarah@acme.com']);

  const addMember = () => {
    const normalized = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      setError('Enter a valid email address.');
      return;
    }
    if (members.includes(normalized)) {
      setError('This person is already invited.');
      return;
    }
    setMembers((current) => [...current, normalized]);
    setEmail('');
    setError('');
  };

  return (
    <ShowcaseCard
      className="city-showcase-invite"
      description="Add people to Acme Workspace"
      icon={UserPlus}
      title="Invite members"
    >
      <div className="city-showcase-member-list" aria-label="Pending invitations">
        {members.map((member) => (
          <Badge appearance="outline" key={member} tone="neutral">
            {member}
          </Badge>
        ))}
      </div>
      <Field.Root invalid={Boolean(error)}>
        <Field.Label>Email</Field.Label>
        <Input
          aria-describedby={error ? 'invite-email-error' : undefined}
          onChange={(event) => setEmail(event.currentTarget.value)}
          placeholder="name@company.com"
          size="sm"
          type="email"
          value={email}
        />
        {error ? (
          <p className="city-showcase-field-error" id="invite-email-error" role="alert">
            {error}
          </p>
        ) : null}
      </Field.Root>
      <Field.Root>
        <Field.Label>Role</Field.Label>
        <Select.Root
          items={{ admin: 'Admin', member: 'Member', viewer: 'Viewer' }}
          onValueChange={(value) => setRole(value ?? 'member')}
          size="sm"
          value={role}
        >
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={5}>
              <Select.Popup>
                <Select.List>
                  {Object.entries({ admin: 'Admin', member: 'Member', viewer: 'Viewer' }).map(
                    ([value, label]) => (
                      <Select.Item key={value} value={value}>
                        <Select.ItemIndicator />
                        <Select.ItemText>{label}</Select.ItemText>
                      </Select.Item>
                    ),
                  )}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </Field.Root>
      <label className="city-showcase-checkbox-row">
        <Checkbox
          checked={sendEmail}
          onCheckedChange={(checked) => setSendEmail(checked === true)}
        />
        Send invite email
      </label>
      <Button onClick={addMember} size="sm" type="button" variant="primary">
        Send invite as {role}
      </Button>
    </ShowcaseCard>
  );
}

function QuickCommandCard() {
  const [query, setQuery] = useState('');
  const results = COMMANDS.filter((command) =>
    command.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <ShowcaseCard
      className="city-showcase-command"
      description="Jump to a task or document"
      icon={Command}
      title="Quick command"
    >
      <Field.Root>
        <Field.Label className="city-docs-sr-only">Search commands</Field.Label>
        <SearchInput.Root onValueChange={setQuery} size="sm" value={query}>
          <SearchInput.Group>
            <InputGroup.Addon>
              <Search aria-hidden="true" size={15} />
            </InputGroup.Addon>
            <SearchInput.Input placeholder="Type a command or search…" />
            <SearchInput.Clear aria-label="Clear command search" />
          </SearchInput.Group>
        </SearchInput.Root>
      </Field.Root>
      <ul className="city-showcase-command-list" aria-live="polite">
        {results.length > 0 ? (
          results.map((command) => (
            <li key={command.label}>
              <a href={command.path}>
                <span>{command.label}</span>
                <kbd>{command.hint}</kbd>
              </a>
            </li>
          ))
        ) : (
          <li className="city-showcase-empty">No matching commands</li>
        )}
      </ul>
    </ShowcaseCard>
  );
}

function SessionSecurityCard() {
  const [sessions, setSessions] = useState([
    {
      detail: 'New York, US · This device',
      icon: Laptop,
      id: 'mac',
      name: 'Chrome on macOS',
      current: true,
    },
    {
      detail: 'New York, US · iPhone 15',
      icon: Smartphone,
      id: 'ios',
      name: 'Safari on iOS',
      current: false,
    },
    {
      detail: 'Boston, US · 8m ago',
      icon: Laptop,
      id: 'win',
      name: 'Chrome on Windows',
      current: false,
    },
  ]);

  return (
    <ShowcaseCard
      className="city-showcase-security"
      description="Active sessions and account access"
      icon={ShieldCheck}
      title="Session & security"
    >
      <ul className="city-showcase-session-list" aria-live="polite">
        {sessions.map((session) => {
          const Icon = session.icon;
          return (
            <li key={session.id}>
              <span className="city-showcase-session-icon">
                <Icon aria-hidden="true" size={15} />
              </span>
              <span>
                <strong>{session.name}</strong>
                <small>{session.detail}</small>
              </span>
              {session.current ? (
                <Badge appearance="subtle" tone="success">
                  Active
                </Badge>
              ) : (
                <Button
                  aria-label={`Revoke ${session.name}`}
                  onClick={() =>
                    setSessions((current) => current.filter((item) => item.id !== session.id))
                  }
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  Revoke
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      <Button
        disabled={sessions.length === 1}
        onClick={() => setSessions((current) => current.filter((session) => session.current))}
        size="sm"
        type="button"
        variant="outline"
      >
        Sign out all other sessions
      </Button>
    </ShowcaseCard>
  );
}

function UploadDocumentsCard() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <ShowcaseCard
      className="city-showcase-upload"
      description="Add local documents to this workspace"
      icon={Upload}
      title="Upload documents"
    >
      <FileUpload.Root
        accept=".pdf,.doc,.docx,.txt,.csv"
        density="compact"
        files={files}
        labels={{
          input: 'Upload local documents',
          remove: (file) => `Remove ${file?.name ?? 'file'}`,
        }}
        multiple
        onFilesChange={setFiles}
      >
        <div className="city-showcase-upload-drop">
          <FileText aria-hidden="true" size={22} />
          <span>
            <strong>
              {files.length
                ? `${files.length} file${files.length === 1 ? '' : 's'} ready`
                : 'Choose documents'}
            </strong>
            <small>PDF, DOCX, TXT or CSV · stays on this device</small>
          </span>
          <FileUpload.Trigger>Choose files</FileUpload.Trigger>
        </div>
        <FileUpload.List />
      </FileUpload.Root>
    </ShowcaseCard>
  );
}

function NotificationsCard() {
  const [settings, setSettings] = useState({
    email: true,
    marketing: false,
    security: true,
    weekly: false,
  });
  const items = [
    ['email', 'Email updates', 'Product changes and announcements'],
    ['security', 'Security alerts', 'Important account notifications'],
    ['weekly', 'Weekly digest', 'A summary every Monday'],
    ['marketing', 'Marketing emails', 'Tips, guides and product updates'],
  ] as const;

  return (
    <ShowcaseCard
      className="city-showcase-notifications"
      description="How and when you are notified"
      icon={Bell}
      title="Notifications"
    >
      <div className="city-showcase-settings-list">
        {items.map(([key, title, description]) => (
          <div key={key}>
            <span className="city-showcase-setting-copy">
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <Switch
              aria-label={title}
              checked={settings[key]}
              onCheckedChange={(checked) =>
                setSettings((current) => ({ ...current, [key]: checked }))
              }
              size="sm"
            />
          </div>
        ))}
      </div>
      <Button
        onClick={() =>
          toast.success('Preferences saved', {
            description: 'Notification settings were updated.',
          })
        }
        size="sm"
        type="button"
        variant="primary"
      >
        Save preferences
      </Button>
    </ShowcaseCard>
  );
}

function ActivityFeedCard() {
  return (
    <ShowcaseCard
      className="city-showcase-activity"
      description="Latest changes across the workspace"
      icon={Clock3}
      title="Activity feed"
    >
      <ol className="city-showcase-activity-list">
        {ACTIVITY.map((item) => (
          <li key={`${item.name}-${item.title}`}>
            <Avatar alt={`${item.name} profile`} src={item.avatar} />
            <span>
              <span>
                <strong>{item.name}</strong> {item.title}
              </span>
              <small>{item.detail}</small>
            </span>
            <time>{item.time}</time>
          </li>
        ))}
      </ol>
    </ShowcaseCard>
  );
}

const SHOWCASE_ITEMS = [
  { Component: ScheduleCard, id: 'schedule' },
  { Component: InviteMembersCard, id: 'invite' },
  { Component: IssueTriageCard, id: 'issues' },
  { Component: CheckoutCard, id: 'checkout' },
  { Component: OrdersCard, id: 'orders' },
  { Component: QuickCommandCard, id: 'command' },
  { Component: SessionSecurityCard, id: 'security' },
  { Component: UploadDocumentsCard, id: 'upload' },
  { Component: NotificationsCard, id: 'notifications' },
  { Component: ActivityFeedCard, id: 'activity' },
] as const;

export function HomeShowcase() {
  return (
    <section
      aria-label="Interactive product examples"
      className="city-showcase-grid"
      id="product-contexts"
    >
      {SHOWCASE_ITEMS.map(({ Component, id }) => (
        <div className="city-showcase-item" data-organism={id} key={id}>
          <Component />
        </div>
      ))}
    </section>
  );
}
