import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { App } from './app';
import {
  assignCrew,
  INITIAL_WORK_ORDERS,
  selectWorkOrders,
  type WorkOrderFilters,
} from './operations-data';

async function chooseOption(user: UserEvent, name: string, option: string) {
  await user.click(screen.getByRole('combobox', { name }));
  await user.click(await screen.findByRole('option', { name: option }));
}

function renderAt(pathname = '/work-orders') {
  window.history.replaceState(null, '', pathname);
  return render(<App />);
}

beforeEach(() => {
  window.history.replaceState(null, '', '/work-orders');
  delete document.documentElement.dataset.theme;
});

describe('operations selectors', () => {
  const defaultFilters: WorkOrderFilters = {
    district: '전체 자치구',
    query: '',
    sortDirection: false,
    status: 'all',
  };

  it('orders attention work ahead of normal and completed work', () => {
    const result = selectWorkOrders(INITIAL_WORK_ORDERS, defaultFilters);

    expect(result[0]?.id).toBe('WO-3127');
    expect(result.findIndex((order) => order.status === '완료')).toBeGreaterThan(
      result.findIndex((order) => order.status === '진행 중'),
    );
  });

  it('filters across district, status and Korean search text', () => {
    const result = selectWorkOrders(INITIAL_WORK_ORDERS, {
      district: '성동구',
      query: '가로등',
      sortDirection: 'asc',
      status: 'active',
    });

    expect(result.map((order) => order.id)).toEqual(['WO-3125']);
  });

  it('assigns a crew without mutating the fixture', () => {
    const nextOrders = assignCrew(INITIAL_WORK_ORDERS, 'WO-3127', '도심 도로팀');
    const previous = INITIAL_WORK_ORDERS.find((order) => order.id === 'WO-3127');
    const assigned = nextOrders.find((order) => order.id === 'WO-3127');

    expect(previous?.crew).toBeNull();
    expect(assigned).toMatchObject({ crew: '도심 도로팀', status: '배정됨' });
    expect(assigned?.activities[0]?.description).toContain('배정했어요');
  });
});

describe('Vite design-system consumer page', () => {
  it('renders the documented data-management hierarchy', () => {
    renderAt();

    expect(screen.getByRole('navigation', { name: '현재 위치' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 1, name: '현장 작업' })).toBeVisible();
    expect(screen.getByRole('button', { name: '최우선 작업 열기' })).toBeVisible();
    expect(screen.getByRole('heading', { level: 2, name: /조치가 필요한 작업/ })).toBeVisible();
    expect(screen.getByRole('group', { name: '현장 작업 필터' })).toBeVisible();
    expect(screen.getByRole('region', { name: '현장 작업' })).toBeVisible();
    expect(screen.getByRole('table', { name: '현장 작업 목록' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: '자치구' })).toHaveClass(
      'city-ops-col-district',
    );
    expect(screen.getByRole('columnheader', { name: '담당팀' })).toHaveClass('city-ops-col-crew');
    expect(screen.getByRole('columnheader', { name: /처리 기한/ })).toHaveClass('city-ops-col-sla');
    expect(screen.getByRole('columnheader', { name: '상태' })).toHaveClass('city-ops-col-status');
    expect(screen.getByRole('navigation', { name: '현장 작업 페이지' })).toBeVisible();
  });

  it('searches, shows a recoverable empty state and resets filters', async () => {
    const user = userEvent.setup();
    renderAt();

    const search = screen.getByRole('searchbox', { name: '작업 검색' });
    await user.type(search, '없는 작업');
    await user.keyboard('{Enter}');

    expect(screen.getByText('조건에 맞는 작업이 없어요.')).toBeVisible();
    expect(screen.getByText('필터 결과 0건')).toBeVisible();

    await user.click(screen.getAllByRole('button', { name: '필터 초기화' })[0]!);

    expect(screen.getByRole('button', { name: /WO-3127 .* 상세 보기/ })).toBeVisible();
    expect(search).toHaveValue('');
  });

  it('filters by status and keeps the result relationship visible', async () => {
    const user = userEvent.setup();
    renderAt();

    await chooseOption(user, '작업 상태', '완료');

    expect(screen.getByText('필터 결과 3건')).toBeVisible();
    expect(screen.getByRole('button', { name: /WO-3108 .* 상세 보기/ })).toBeVisible();
    expect(screen.queryByRole('button', { name: /WO-3127 .* 상세 보기/ })).toBeNull();
  });

  it('paginates the result set without changing the filter context', async () => {
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByRole('button', { name: '2페이지' }));

    expect(screen.getByRole('button', { name: /WO-3093 .* 상세 보기/ })).toBeVisible();
    expect(screen.getByText(/7–12 표시/)).toBeVisible();
    expect(screen.getByRole('combobox', { name: '작업 상태' })).toHaveTextContent('전체 상태');
  });

  it('preserves rows while refreshing and reports completion', async () => {
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByRole('button', { name: '새로고침' }));

    expect(screen.getByRole('table', { name: '현장 작업 목록' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    expect(screen.getByRole('button', { name: /WO-3127 .* 상세 보기/ })).toBeVisible();
    expect(screen.getByText('새로고침 중…')).toBeVisible();

    await waitFor(() => expect(screen.getByText('마지막 업데이트 10:07')).toBeVisible());
    expect(await screen.findByText('목록을 새로고쳤어요.')).toBeVisible();
  });

  it('opens row details, exposes a disabled reason and restores trigger focus', async () => {
    const user = userEvent.setup();
    renderAt();

    const trigger = screen.getByRole('button', { name: /WO-3127 .* 상세 보기/ });
    trigger.focus();
    await user.keyboard('{Enter}');

    const drawer = await screen.findByRole('dialog', { name: '도로 침하 안전 조치' });
    const completion = within(drawer).getByRole('button', { name: '작업 완료' });
    const reasonId = completion.getAttribute('aria-describedby');

    expect(completion).toBeDisabled();
    expect(reasonId).not.toBeNull();
    expect(document.getElementById(reasonId!)).toHaveTextContent('먼저 담당팀을 배정해 주세요.');

    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: '도로 침하 안전 조치' })).toBeNull(),
    );
    expect(trigger).toHaveFocus();
  });

  it('blocks a waiting work order until its stated dependency is resolved', async () => {
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByRole('button', { name: /WO-3121 .* 상세 보기/ }));

    const drawer = await screen.findByRole('dialog', { name: '환승 안내판 파손 교체' });
    const start = within(drawer).getByRole('button', { name: '작업 시작' });
    const reasonId = start.getAttribute('aria-describedby');

    expect(start).toBeDisabled();
    expect(reasonId).not.toBeNull();
    expect(document.getElementById(reasonId!)).toHaveTextContent(
      '교체 부품은 11:30에 도착할 예정이에요.',
    );
  });

  it('shows a field error instead of disabling a recoverable assignment', async () => {
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByRole('button', { name: /WO-3127 .* 상세 보기/ }));
    await user.click(await screen.findByRole('button', { name: '담당팀 배정' }));

    const dialog = await screen.findByRole('dialog', { name: '담당팀 배정' });
    const save = within(dialog).getByRole('button', { name: '저장' });
    expect(save).toBeEnabled();

    await user.click(save);

    expect(within(dialog).getByText('팀을 선택해 주세요.')).toBeVisible();
  });

  it('uses the close reason to discard an assignment draft closed by Escape', async () => {
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByRole('button', { name: /WO-3127 .* 상세 보기/ }));
    await user.click(await screen.findByRole('button', { name: '담당팀 배정' }));
    await chooseOption(user, '담당팀', '도심 도로팀');
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog', { name: '담당팀 배정' })).toBeNull());
    await user.click(screen.getByRole('button', { name: '담당팀 배정' }));

    expect(await screen.findByRole('combobox', { name: '담당팀' })).toHaveTextContent('선택');
  });

  it('advances an urgent work order through assignment, start and completion', async () => {
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByRole('button', { name: /WO-3127 .* 상세 보기/ }));
    await user.click(await screen.findByRole('button', { name: '담당팀 배정' }));
    await chooseOption(user, '담당팀', '도심 도로팀');
    await user.click(screen.getByRole('button', { name: '저장' }));

    expect(await screen.findByText('WO-3127 작업을 도심 도로팀에 배정했어요.')).toBeVisible();
    expect(
      within(screen.getByRole('dialog', { name: '도로 침하 안전 조치' })).getByText('도심 도로팀'),
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: '작업 시작' }));
    expect(await screen.findByText('WO-3127 작업을 시작했어요.')).toBeVisible();

    await user.click(screen.getByRole('button', { name: '작업 완료' }));
    expect(await screen.findByText('작업을 완료했어요.')).toBeVisible();
    expect(screen.queryByRole('button', { name: '담당팀 변경' })).toBeNull();
  });

  it('switches light, dark and system themes through the public theme contract', async () => {
    const user = userEvent.setup();
    renderAt();

    await chooseOption(user, '화면 테마', '다크 테마');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    await chooseOption(user, '화면 테마', '라이트 테마');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    await chooseOption(user, '화면 테마', '시스템 테마');
    expect(document.documentElement).not.toHaveAttribute('data-theme');
  });
});

describe('dashboard routing', () => {
  it.each([
    ['/', '운영 현황'],
    ['/work-orders', '현장 작업'],
    ['/maintenance', '정비 계획'],
    ['/assets', '시설 자산'],
    ['/crews', '현장팀'],
    ['/reports', '운영 리포트'],
    ['/activity', '활동 기록'],
    ['/service-status', '서비스 상태'],
  ])('renders the %s route on direct entry', (pathname, heading) => {
    renderAt(pathname);

    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  });

  it.each([
    ['/', '성수 배수펌프장 정기 점검'],
    ['/maintenance', '시작 시간순'],
    ['/assets', 'AST-0842'],
    ['/crews', '강남대로 제어반 점검'],
    ['/reports', '강남구 기한 준수율 92.8% · 목표까지 3.2%p'],
    ['/activity', 'WO-3127 도로 침하 안전 조치의 현장 통제를 시작했어요.'],
    ['/service-status', '최근 24시간 동안 서비스 중단이나 데이터 유실을 감지하지 않았어요.'],
  ])('restores meaningful content for %s', (pathname, content) => {
    renderAt(pathname);

    expect(screen.getByText(content)).toBeVisible();
  });

  it('provides a recoverable not-found page for unknown paths', () => {
    renderAt('/unknown');

    expect(
      screen.getByRole('heading', { level: 1, name: '페이지를 찾을 수 없어요.' }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: '운영 현황으로' })).toHaveAttribute('href', '/');
  });

  it('moves between routes and responds to browser history', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('link', { name: '현장 작업' }));
    expect(window.location.pathname).toBe('/work-orders');
    expect(screen.getByRole('heading', { level: 1, name: '현장 작업' })).toBeVisible();

    await user.click(screen.getByRole('link', { name: '시설 자산' }));
    expect(window.location.pathname).toBe('/assets');

    window.history.back();
    await waitFor(() => expect(window.location.pathname).toBe('/work-orders'));
    expect(screen.getByRole('heading', { level: 1, name: '현장 작업' })).toBeVisible();
  });

  it('uses the same route contract in the mobile navigation drawer', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('button', { name: '메뉴 열기' }));
    const drawer = await screen.findByRole('dialog', { name: '전체 메뉴' });
    await user.click(within(drawer).getByRole('link', { name: '서비스 상태' }));

    expect(window.location.pathname).toBe('/service-status');
    expect(screen.getByRole('heading', { level: 1, name: '서비스 상태' })).toBeVisible();
    await waitFor(() => expect(screen.queryByRole('dialog', { name: '전체 메뉴' })).toBeNull());
  });
});
