import { useEffect, useMemo, useState } from 'react';
import { AlertDialog } from '@opnay/city-ds-react/alert-dialog';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { Dialog } from '@opnay/city-ds-react/dialog';
import { Drawer } from '@opnay/city-ds-react/drawer';
import { FilterBar } from '@opnay/city-ds-react/filter-bar';
import { Input } from '@opnay/city-ds-react/input';
import { Panel } from '@opnay/city-ds-react/panel';
import { Popover } from '@opnay/city-ds-react/popover';
import { Table, type TableSortDirection } from '@opnay/city-ds-react/table';
import { Tooltip } from '@opnay/city-ds-react/tooltip';

import { isControlled, isEnabled, toControlSize, type PreviewOptionProps } from './types';

const DIALOG_SIZES = ['sm', 'md', 'lg', 'xl', 'full'] as const;
const SIDES = ['top', 'right', 'bottom', 'left'] as const;
const ALIGNS = ['start', 'center', 'end'] as const;
const APPEARANCES = ['plain', 'band', 'outline'] as const;
const TABLE_ROWS = [
  { id: 'river', name: '한강', status: '점검 중' },
  { id: 'park', name: '도시 공원', status: '정상' },
] as const;

function isOneOf<Value extends string>(
  value: boolean | string | undefined,
  values: readonly Value[],
  fallback: Value,
): Value {
  return typeof value === 'string' && values.includes(value as Value) ? (value as Value) : fallback;
}

function DemoTable() {
  return (
    <Table.Root className="city-docs-example-overflow-table">
      <Table.Header>
        <Table.Row>
          <Table.Head>데이터셋</Table.Head>
          <Table.Head>상태</Table.Head>
          <Table.Head>담당 조직</Table.Head>
          <Table.Head>대상 지역</Table.Head>
          <Table.Head>갱신 일시</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>도시 생활 인구</Table.Cell>
          <Table.Cell>공개</Table.Cell>
          <Table.Cell>플랫폼 팀</Table.Cell>
          <Table.Cell>서울 전역</Table.Cell>
          <Table.Cell>2026-09-02</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

export function AlertDialogPreview({ destructive }: PreviewOptionProps) {
  const [open, setOpen] = useState(false);
  const isDestructive = isEnabled(destructive);

  return (
    <AlertDialog.Root onOpenChange={setOpen} open={open}>
      <AlertDialog.Trigger
        render={<Button variant={isDestructive ? 'destructive' : 'secondary'} />}
      >
        {isDestructive ? '프로젝트 삭제' : '프로젝트 보관'}
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Viewport>
          <AlertDialog.Popup>
            <AlertDialog.Title>
              {isDestructive ? '프로젝트를 삭제하시겠습니까?' : '프로젝트를 보관하시겠습니까?'}
            </AlertDialog.Title>
            <AlertDialog.Description>
              {isDestructive
                ? '이 작업은 되돌릴 수 없습니다.'
                : '보관된 프로젝트는 나중에 복원할 수 있습니다.'}
            </AlertDialog.Description>
            <div className="mt-5 flex justify-end gap-2">
              <AlertDialog.Cancel render={<Button variant="secondary" />}>취소</AlertDialog.Cancel>
              <AlertDialog.Action
                destructive={isDestructive}
                render={<Button variant={isDestructive ? 'destructive' : 'primary'} />}
              >
                {isDestructive ? '삭제' : '보관'}
              </AlertDialog.Action>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}

export function DialogPreview({ scroll, size }: PreviewOptionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger render={<Button variant="secondary" />}>프로젝트 세부 정보</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup
            scroll={scroll === 'body' ? 'body' : 'none'}
            size={isOneOf(size, DIALOG_SIZES, 'md')}
          >
            <Dialog.Header>
              <div>
                <Dialog.Title>프로젝트 세부 정보</Dialog.Title>
                <Dialog.Description>운영에 필요한 핵심 정보를 확인합니다.</Dialog.Description>
              </div>
            </Dialog.Header>
            <Dialog.Body>
              <p>Atlas 프로젝트는 플랫폼 팀에서 관리합니다.</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close render={<Button variant="secondary" />}>닫기</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function DrawerPreview({ modal, side, size }: PreviewOptionProps) {
  const [open, setOpen] = useState(false);
  const resolvedSide = side === 'left' || side === 'bottom' ? side : 'right';

  return (
    <Drawer.Root
      modal={isEnabled(modal)}
      onOpenChange={setOpen}
      open={open}
      swipeDirection={resolvedSide === 'bottom' ? 'down' : resolvedSide}
    >
      <Drawer.Trigger render={<Button variant="secondary" />}>
        {resolvedSide} Drawer 열기
      </Drawer.Trigger>
      <Drawer.Portal>
        {isEnabled(modal) ? <Drawer.Backdrop /> : null}
        <Drawer.Viewport side={resolvedSide}>
          <Drawer.Popup side={resolvedSide} size={isOneOf(size, DIALOG_SIZES, 'md')}>
            <Drawer.Header>
              <div>
                <Drawer.Title>{resolvedSide} Drawer</Drawer.Title>
                <Drawer.Description>보조 작업 표면입니다.</Drawer.Description>
              </div>
            </Drawer.Header>
            <Drawer.Content>작업 내용을 배치합니다.</Drawer.Content>
            <Drawer.Footer>
              <Drawer.Close render={<Button variant="secondary" />}>닫기</Drawer.Close>
            </Drawer.Footer>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function PopoverPreview({ align, modal, mode, side }: PreviewOptionProps) {
  const [open, setOpen] = useState(false);
  const rootProps = isControlled(mode) ? { onOpenChange: setOpen, open } : {};

  return (
    <Popover.Root modal={isEnabled(modal)} {...rootProps}>
      <Popover.Trigger>릴리스 정보</Popover.Trigger>
      <Popover.Portal>
        {isEnabled(modal) ? <Popover.Backdrop /> : null}
        <Popover.Positioner
          align={isOneOf(align, ALIGNS, 'center')}
          side={isOneOf(side, SIDES, 'bottom')}
          sideOffset={8}
        >
          <Popover.Popup>
            <Popover.Title>릴리스 정보</Popover.Title>
            <Popover.Description>v0.1.1이 방금 배포되었습니다.</Popover.Description>
            <div className="mt-4 flex justify-end">
              <Popover.Close>확인</Popover.Close>
            </div>
            <Popover.Arrow />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function TooltipPreview({ mode, side }: PreviewOptionProps) {
  const [open, setOpen] = useState(false);
  const rootProps = isControlled(mode) ? { onOpenChange: setOpen, open } : {};

  return (
    <Tooltip.Provider delay={0}>
      <Tooltip.Root {...rootProps}>
        <Tooltip.Trigger aria-label="배포 정보">배포 정보</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side={isOneOf(side, SIDES, 'top')} sideOffset={8}>
            <Tooltip.Popup>
              승인된 변경 요청이 필요합니다.
              <Tooltip.Arrow />
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export function BadgePreview({ appearance, mode, size, tone }: PreviewOptionProps) {
  const commonProps = {
    appearance: isOneOf(appearance, ['solid', 'subtle', 'outline'] as const, 'solid'),
    size: isOneOf(size, ['sm', 'md', 'lg'] as const, 'md'),
    tone: isOneOf(
      tone,
      ['neutral', 'info', 'success', 'warning', 'destructive'] as const,
      'neutral',
    ),
  };

  if (mode === 'count') return <Badge count={3} {...commonProps} />;
  if (mode === 'dot') return <Badge aria-label="알림 상태" dot {...commonProps} />;
  return <Badge {...commonProps}>알림</Badge>;
}

export function DataTableRegionPreview({ appearance, showHint }: PreviewOptionProps) {
  return (
    <DataTableRegion
      appearance={isOneOf(appearance, APPEARANCES, 'plain')}
      hint="표를 가로로 스크롤해 나머지 열을 확인하십시오."
      label="발행 기록"
      showHint={isEnabled(showHint)}
    >
      <DemoTable />
    </DataTableRegion>
  );
}

export function TablePreview({
  scrollAppearance,
  selection,
  size,
  sort,
  variant,
}: PreviewOptionProps) {
  const [direction, setDirection] = useState<TableSortDirection | false>(
    sort === 'asc' || sort === 'desc' ? sort : false,
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(
    selection === 'all'
      ? TABLE_ROWS.map((row) => row.id)
      : selection === 'indeterminate'
        ? ['river']
        : [],
  );

  useEffect(() => {
    setDirection(sort === 'asc' || sort === 'desc' ? sort : false);
  }, [sort]);

  useEffect(() => {
    setSelectedIds(
      selection === 'all'
        ? TABLE_ROWS.map((row) => row.id)
        : selection === 'indeterminate'
          ? ['river']
          : [],
    );
  }, [selection]);

  const rows = useMemo(
    () =>
      direction
        ? [...TABLE_ROWS].sort((left, right) => {
            const result = left.name.localeCompare(right.name, 'ko-KR');
            return direction === 'asc' ? result : -result;
          })
        : TABLE_ROWS,
    [direction],
  );
  const selectionState =
    selectedIds.length === rows.length ? true : selectedIds.length > 0 ? 'indeterminate' : false;

  const setRowSelected = (id: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked ? [...new Set([...current, id])] : current.filter((selectedId) => selectedId !== id),
    );
  };

  return (
    <DataTableRegion
      appearance={isOneOf(scrollAppearance, APPEARANCES, 'outline')}
      label="장소 목록"
    >
      <Table.Root
        aria-label="옵션을 조절할 수 있는 장소"
        size={toControlSize(size)}
        variant={variant === 'surface' ? 'surface' : 'line'}
      >
        <Table.Header>
          <Table.Row>
            <Table.SelectionHead
              checked={selectionState}
              label="모든 장소 선택"
              onCheckedChange={(checked) =>
                setSelectedIds(checked ? rows.map((row) => row.id) : [])
              }
            />
            <Table.Head
              aria-sort={
                direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'
              }
            >
              <Table.SortButton direction={direction} onDirectionChange={setDirection}>
                이름
              </Table.SortButton>
            </Table.Head>
            <Table.Head>상태</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id}>
              <Table.SelectionCell
                checked={selectedIds.includes(row.id)}
                label={`${row.name} 선택`}
                onCheckedChange={(checked) => setRowSelected(row.id, checked)}
              />
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </DataTableRegion>
  );
}

export function PanelPreview({ actions }: PreviewOptionProps) {
  const hasActions = actions === 'provided';

  return (
    <Panel.Root
      aria-labelledby="panel-preview-title"
      className="overflow-hidden rounded-city-md border border-city-border"
      render={<section />}
    >
      <Panel.Header
        actions={
          hasActions ? (
            <Button size="sm" variant="ghost">
              새로고침
            </Button>
          ) : undefined
        }
        className="border-b border-city-border px-3 py-2"
      >
        <strong className="text-sm" id="panel-preview-title">
          배포 상태
        </strong>
      </Panel.Header>
      <Panel.Body className="p-4 text-sm">프로덕션 배포가 정상입니다.</Panel.Body>
    </Panel.Root>
  );
}

export function FilterBarPreview({ appearance, density }: PreviewOptionProps) {
  return (
    <FilterBar
      actions={
        <Button size="sm" variant="outline">
          적용
        </Button>
      }
      appearance={isOneOf(appearance, APPEARANCES, 'band')}
      density={density === 'compact' ? 'compact' : 'comfortable'}
    >
      <Input aria-label="검색" placeholder="필터 검색" />
    </FilterBar>
  );
}
