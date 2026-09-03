import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Alert } from '@opnay/city-ds-react/alert';
import { Breadcrumbs } from '@opnay/city-ds-react/breadcrumbs';
import { Button } from '@opnay/city-ds-react/button';
import { EmptyState } from '@opnay/city-ds-react/empty-state';
import { Menu } from '@opnay/city-ds-react/menu';
import { Pagination } from '@opnay/city-ds-react/pagination';
import { Progress } from '@opnay/city-ds-react/progress';
import { Skeleton } from '@opnay/city-ds-react/skeleton';
import { Tabs } from '@opnay/city-ds-react/tabs';
import { Toaster, toast } from '@opnay/city-ds-react/toast';
import { Toolbar } from '@opnay/city-ds-react/toolbar';

import { isControlled, isEnabled, toControlSize, type PreviewOptionProps } from './types';

const ALERT_TONES = ['neutral', 'info', 'success', 'warning', 'destructive'] as const;
const TOOLBAR_APPEARANCES = ['plain', 'band', 'outline'] as const;

function isOneOf<Value extends string>(
  value: boolean | string | undefined,
  values: readonly Value[],
  fallback: Value,
): Value {
  return typeof value === 'string' && values.includes(value as Value) ? (value as Value) : fallback;
}

function TabPanels({ disabled }: { disabled: boolean }) {
  return (
    <>
      <Tabs.List>
        <Tabs.Tab value="overview">개요</Tabs.Tab>
        <Tabs.Tab value="activity">활동</Tabs.Tab>
        <Tabs.Tab disabled={disabled} value="settings">
          설정
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">프로젝트 개요입니다.</Tabs.Panel>
      <Tabs.Panel value="activity">최근 활동입니다.</Tabs.Panel>
      <Tabs.Panel value="settings">설정</Tabs.Panel>
    </>
  );
}

export function AlertPreview({ appearance, showIcon, tone, variant }: PreviewOptionProps) {
  const variantProps =
    typeof variant === 'string' && ['info', 'success', 'warning', 'error'].includes(variant)
      ? { variant: variant as 'info' | 'success' | 'warning' | 'error' }
      : {};

  return (
    <Alert.Root
      appearance={appearance === 'outline' ? 'outline' : 'subtle'}
      showIcon={isEnabled(showIcon)}
      tone={isOneOf(tone, ALERT_TONES, 'info')}
      {...variantProps}
    >
      <Alert.Title>변경 사항을 저장했습니다.</Alert.Title>
      <Alert.Description>팀에 최신 설정이 반영되었습니다.</Alert.Description>
    </Alert.Root>
  );
}

export function EmptyStatePreview({ density }: PreviewOptionProps) {
  return (
    <EmptyState.Root density={density === 'compact' ? 'compact' : 'default'}>
      <EmptyState.Icon>□</EmptyState.Icon>
      <EmptyState.Title>아직 데이터가 없습니다</EmptyState.Title>
      <EmptyState.Description>첫 레코드를 추가해 이 표를 채우십시오.</EmptyState.Description>
      <EmptyState.Actions>
        <Button>레코드 추가</Button>
      </EmptyState.Actions>
    </EmptyState.Root>
  );
}

export function ProgressPreview({ shape, size, status }: PreviewOptionProps) {
  const resolvedStatus = isOneOf(
    status,
    ['progressing', 'complete', 'indeterminate'] as const,
    'progressing',
  );
  const value =
    resolvedStatus === 'complete' ? 100 : resolvedStatus === 'indeterminate' ? null : 55;
  const label = `작업 ${resolvedStatus}`;

  if (shape === 'circular') {
    return <Progress.Circular aria-label={label} size={toControlSize(size)} value={value} />;
  }

  return (
    <Progress.Root aria-label={label} size={toControlSize(size)} value={value}>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
      <Progress.Value />
    </Progress.Root>
  );
}

export function SkeletonPreview({ size, variant }: PreviewOptionProps) {
  return (
    <Skeleton
      size={isOneOf(size, ['sm', 'md', 'lg'] as const, 'md')}
      variant={isOneOf(variant, ['text', 'circular', 'rectangular'] as const, 'text')}
    />
  );
}

export function ToastPreview({ tone }: PreviewOptionProps) {
  const toastTone = isOneOf(tone, ALERT_TONES, 'neutral');

  const showToast = () => {
    const options = { description: '변경 사항을 반영했습니다.', toasterId: 'toast-playground' };

    if (toastTone === 'success') return toast.success('저장되었습니다.', options);
    if (toastTone === 'warning') return toast.warning('확인이 필요합니다.', options);
    if (toastTone === 'destructive') return toast.error('저장하지 못했습니다.', options);
    if (toastTone === 'info') return toast.info('최신 상태입니다.', options);
    return toast('알림을 표시합니다.', options);
  };

  return (
    <>
      <Button onClick={showToast}>알림 표시</Button>
      <Toaster duration={5000} id="toast-playground" />
    </>
  );
}

export function BreadcrumbsPreview({ overflow, route }: PreviewOptionProps) {
  const isLongRoute = route === 'long';

  return (
    <Breadcrumbs.Root aria-label="문서 경로">
      <Breadcrumbs.List>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link render={<Link to="/" />}>홈</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        {isLongRoute && overflow === 'ellipsis' ? (
          <Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Ellipsis />
          </Breadcrumbs.Item>
        ) : null}
        <Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Link render={<Link to="/components" />}>컴포넌트</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Page>Breadcrumbs</Breadcrumbs.Page>
        </Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  );
}

export function MenuPreview({ density, mode, variant }: PreviewOptionProps) {
  const [open, setOpen] = useState(false);
  const rootProps = isControlled(mode) ? { onOpenChange: setOpen, open } : {};

  return (
    <Menu.Root density={density === 'compact' ? 'compact' : 'comfortable'} {...rootProps}>
      <Menu.Trigger render={<Button variant="outline" />}>프로젝트 메뉴</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item>이름 변경</Menu.Item>
            <Menu.Separator />
            <Menu.Item variant={variant === 'destructive' ? 'destructive' : 'default'}>
              삭제
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export function PaginationPreview({ density }: PreviewOptionProps) {
  const [page, setPage] = useState(4);

  return (
    <Pagination.Root
      density={density === 'compact' ? 'compact' : 'comfortable'}
      onPageChange={setPage}
      page={page}
      totalPages={12}
    />
  );
}

export function TabsPreview({ density, disabled, mode }: PreviewOptionProps) {
  const [value, setValue] = useState('overview');
  const rootProps = isControlled(mode)
    ? { onValueChange: setValue, value }
    : { defaultValue: 'overview' };

  return (
    <Tabs.Root density={density === 'compact' ? 'compact' : 'comfortable'} {...rootProps}>
      <TabPanels disabled={isEnabled(disabled)} />
    </Tabs.Root>
  );
}

export function ToolbarPreview({
  appearance,
  buttonVariant,
  linkVariant,
  orientation,
  size,
  toggleVariant,
}: PreviewOptionProps) {
  return (
    <Toolbar.Root
      appearance={isOneOf(appearance, TOOLBAR_APPEARANCES, 'outline')}
      aria-label="문서 도구"
      orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
      size={toControlSize(size)}
    >
      <Toolbar.Group>
        <Toolbar.Button
          variant={typeof buttonVariant === 'string' ? (buttonVariant as never) : 'ghost'}
        >
          저장
        </Toolbar.Button>
        <Toolbar.Link
          render={<Link to="/components" />}
          variant={typeof linkVariant === 'string' ? (linkVariant as never) : 'ghost'}
        >
          문서
        </Toolbar.Link>
        <Toolbar.ToggleGroup aria-label="서식" defaultValue={['bold']} multiple>
          <Toolbar.Toggle
            value="bold"
            variant={typeof toggleVariant === 'string' ? (toggleVariant as never) : 'ghost'}
          >
            굵게
          </Toolbar.Toggle>
        </Toolbar.ToggleGroup>
      </Toolbar.Group>
    </Toolbar.Root>
  );
}
