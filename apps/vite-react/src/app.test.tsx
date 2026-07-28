import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { App } from './app';

function renderApp(path = '/') {
  window.history.replaceState(null, '', path);
  return render(<App />);
}

describe('Relay dashboard', () => {
  it('renders the operational overview and route destinations', () => {
    renderApp();

    expect(screen.getByRole('heading', { level: 1, name: '운영 현황' })).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'Relay 주요 메뉴' })).toBeVisible();
    expect(screen.getByText('Relay (Mock Service)')).toBeVisible();
    expect(screen.getByRole('link', { name: '운영 현황' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('heading', { name: '운영 바로가기' })).toBeVisible();
    expect(screen.getByRole('link', { name: /작업 요청.*건 열림/ })).toHaveAttribute(
      'href',
      '/work-orders',
    );
    expect(screen.getByText('SLA 위험 작업 3건을 확인하십시오')).toBeVisible();
    expect(
      screen.getByRole('status', { name: 'SLA 위험 작업 3건을 확인하십시오' }),
    ).toHaveAttribute('data-tone', 'warning');
  });

  it('filters the work queue and exposes the empty state', async () => {
    const user = userEvent.setup();
    renderApp('/work-orders');

    const search = screen.getByRole('searchbox', { name: '작업 요청 검색' });
    await user.type(search, '없는 시설');

    expect(screen.getByText('조건에 맞는 작업이 없습니다')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '필터 초기화' }));

    expect(search).toHaveValue('');
    expect(screen.getByText('WO-2841')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'SLA 위험' }));

    const table = screen.getByRole('table', { name: '작업 요청 목록' });
    expect(within(table).getByText('WO-2841')).toBeVisible();
    expect(within(table).getByText('WO-2834')).toBeVisible();
    expect(within(table).getByText('WO-2808')).toBeVisible();
    expect(within(table).queryByText('WO-2829')).toBeNull();
  });

  it('submits the quick search before navigating and transfers its query', async () => {
    const user = userEvent.setup();
    renderApp();

    const quickSearch = screen.getByRole('searchbox', { name: '작업 빠른 검색' });
    await user.type(quickSearch, '광화문');

    expect(window.location.pathname).toBe('/');
    await user.click(screen.getByRole('button', { name: '작업 검색 실행' }));

    expect(window.location.pathname).toBe('/work-orders');
    expect(screen.getByRole('searchbox', { name: '작업 요청 검색' })).toHaveValue('광화문');
    const table = screen.getByRole('table', { name: '작업 요청 목록' });
    expect(within(table).getByText('WO-2841')).toBeVisible();
    expect(within(table).queryByText('WO-2829')).toBeNull();
  });

  it('combines district and status filters', async () => {
    const user = userEvent.setup();
    renderApp('/work-orders');

    await user.click(screen.getByRole('combobox', { name: '권역 필터' }));
    await user.click(await screen.findByRole('option', { name: '중구' }));
    await user.click(screen.getByRole('button', { name: '진행 중' }));

    const table = screen.getByRole('table', { name: '작업 요청 목록' });
    expect(within(table).getByText('WO-2808')).toBeVisible();
    expect(within(table).getByText('진행 중')).toHaveAttribute('data-appearance', 'solid');
    expect(within(table).getByText('진행 중')).toHaveAttribute('data-tone', 'info');
    expect(within(table).queryByText('WO-2841')).toBeNull();
    expect(screen.getByText('1건 표시 · 최근 동기화 방금 전')).toBeVisible();
  });

  it('navigates to real dashboard destinations and closes the mobile drawer', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('link', { name: '현장팀' }));
    expect(window.location.pathname).toBe('/crews');
    expect(screen.getByRole('link', { name: '현장팀' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('heading', { level: 1, name: '현장팀' })).toBeVisible();
    expect(screen.getByRole('heading', { name: '현장팀 가용성' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: '주요 메뉴 열기' }));
    const drawer = screen.getByRole('dialog', { name: 'Relay 메뉴' });
    await user.click(within(drawer).getByRole('link', { name: '작업 요청' }));

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Relay 메뉴' })).toBeNull());
    expect(window.location.pathname).toBe('/work-orders');
    expect(screen.getByRole('link', { name: '작업 요청' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('heading', { level: 1, name: '작업 요청' })).toBeVisible();
    expect(screen.getByRole('table', { name: '작업 요청 목록' })).toBeVisible();
  });

  it('selects, sorts, and paginates the work queue', async () => {
    const user = userEvent.setup();
    renderApp('/work-orders');

    const table = screen.getByRole('table', { name: '작업 요청 목록' });
    const rows = within(table).getAllByRole('row');
    expect(rows[1]).toHaveTextContent('WO-2808');
    expect(rows[2]).toHaveTextContent('WO-2841');
    expect(rows[3]).toHaveTextContent('WO-2834');
    expect(within(table).getByText('SLA 위험 92%')).toBeVisible();
    await user.click(within(table).getByRole('checkbox', { name: 'WO-2841 선택' }));
    expect(screen.getByText('1개 선택됨')).toBeVisible();

    const sortButton = within(table).getByRole('button', {
      name: 'SLA 진행 정렬 없음',
    });
    await user.click(sortButton);
    expect(sortButton).toHaveAttribute('data-sort-direction', 'asc');

    await user.click(screen.getByRole('button', { name: '다음 페이지로' }));
    expect(screen.getByRole('button', { name: '2페이지' })).toHaveAttribute('aria-current', 'page');
    expect(within(table).getByText('WO-2808')).toBeVisible();
  });

  it('prioritizes risk alerts and opens the selected work order queue', async () => {
    const user = userEvent.setup();
    renderApp('/activity');

    await user.click(screen.getByRole('button', { name: '알림 3개' }));
    const notifications = screen.getByRole('dialog', { name: '운영 알림' });
    const alertButtons = within(notifications).getAllByRole('button');
    const mostUrgentAlert = within(notifications).getByRole('button', {
      name: 'WO-2808 작업 보기',
    });
    expect(alertButtons[0]).toBe(mostUrgentAlert);

    await user.click(mostUrgentAlert);

    expect(window.location.pathname).toBe('/work-orders');
    expect(screen.getByRole('searchbox', { name: '작업 요청 검색' })).toHaveValue('WO-2808');
    const table = screen.getByRole('table', { name: '작업 요청 목록' });
    expect(within(table).getByText('WO-2808')).toBeVisible();
    expect(within(table).queryByText('WO-2841')).toBeNull();
  });

  it('creates a work order after validating required fields', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: '새 작업 만들기' }));
    const dialog = screen.getByRole('dialog', { name: '새 작업 요청' });

    expect(
      within(dialog).getByText('필수: 작업 제목과 시설 위치. 생성 후 목록과 상세에 표시됩니다.'),
    ).toBeVisible();

    await user.click(within(dialog).getByRole('button', { name: '작업 생성' }));
    expect(within(dialog).getByText('작업 제목을 입력하십시오.')).toBeVisible();
    expect(within(dialog).getByText('시설 위치를 선택하십시오.')).toBeVisible();

    await user.type(within(dialog).getByRole('textbox', { name: '작업 제목' }), '소화전 표지 점검');
    const location = within(dialog).getByRole('combobox', { name: '시설 위치' });
    await user.click(location);
    await user.type(location, '광화문');
    await user.click(screen.getByRole('option', { name: '광화문광장' }));
    await user.click(within(dialog).getByRole('button', { name: '예상 대응시간 15분 늘리기' }));
    await user.click(within(dialog).getByRole('checkbox', { name: '이메일' }));
    await user.click(within(dialog).getByRole('button', { name: '작업 생성' }));

    expect(screen.queryByRole('dialog', { name: '새 작업 요청' })).toBeNull();
    expect(window.location.pathname).toBe('/work-orders');
    expect(screen.getByText('소화전 표지 점검')).toBeVisible();
    expect(screen.getByRole('dialog', { name: '작업이 생성되었습니다' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: /소화전 표지 점검 상세 보기/ }));
    const details = screen.getByRole('dialog', { name: '소화전 표지 점검' });
    expect(within(details).getByText('75분')).toBeVisible();
    expect(within(details).getByText('앱 푸시, 이메일')).toBeVisible();
  });

  it('gives each priority radio its own accessible name', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: '새 작업 만들기' }));
    const dialog = screen.getByRole('dialog', { name: '새 작업 요청' });

    expect(within(dialog).getByRole('radio', { name: '긴급' })).toBeVisible();
    expect(within(dialog).getByRole('radio', { name: '높음' })).toBeVisible();
    expect(within(dialog).getByRole('radio', { name: '보통' })).toBeChecked();
  });

  it('prevents terminal work orders from being reassigned or cancelled', async () => {
    const user = userEvent.setup();
    renderApp('/work-orders');

    await user.click(screen.getByRole('button', { name: '다음 페이지로' }));
    await user.click(
      screen.getByRole('button', {
        name: 'WO-2812 광장 벤치 파손 부품 교체 상세 보기',
      }),
    );
    const details = screen.getByRole('dialog', { name: '광장 벤치 파손 부품 교체' });

    expect(within(details).getByRole('combobox', { name: '담당 현장팀' })).toBeDisabled();
    expect(within(details).getByRole('button', { name: '작업 취소' })).toBeDisabled();
  });

  it('opens details, cancels an order, and restores it from the toast action', async () => {
    const user = userEvent.setup();
    renderApp('/work-orders');

    const trigger = screen.getByRole('button', {
      name: 'WO-2841 보행 신호 제어함 전원 점검 상세 보기',
    });
    await user.click(trigger);
    const details = screen.getByRole('dialog', { name: '보행 신호 제어함 전원 점검' });
    await user.click(within(details).getByRole('button', { name: '작업 취소' }));

    const confirmation = screen.getByRole('alertdialog', { name: '작업을 취소하시겠습니까?' });
    await user.click(within(confirmation).getByRole('button', { name: '작업 취소' }));

    expect(screen.queryByRole('dialog', { name: '보행 신호 제어함 전원 점검' })).toBeNull();
    expect(screen.getByRole('button', { name: '알림 2개' })).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: '작업 요청' })).toHaveFocus(),
    );

    const toast = screen.getByRole('dialog', { name: '작업을 취소했습니다' });
    expect(toast).toBeVisible();
    await user.click(within(toast).getByRole('button', { name: '실행 취소' }));

    expect(screen.getByRole('dialog', { name: '취소를 되돌렸습니다' })).toBeVisible();
  });

  it('returns focus to the selected work order after closing details', async () => {
    const user = userEvent.setup();
    renderApp('/work-orders');

    const trigger = screen.getByRole('button', {
      name: 'WO-2841 보행 신호 제어함 전원 점검 상세 보기',
    });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: '보행 신호 제어함 전원 점검' })).toBeVisible();

    await user.keyboard('{Escape}');

    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('clears hidden selections when a filter changes', async () => {
    const user = userEvent.setup();
    renderApp('/work-orders');

    const table = screen.getByRole('table', { name: '작업 요청 목록' });
    const checkbox = within(table).getByRole('checkbox', { name: 'WO-2841 선택' });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(screen.getByRole('button', { name: 'SLA 위험' }));

    expect(within(table).getByRole('checkbox', { name: 'WO-2841 선택' })).not.toBeChecked();
  });

  it('announces one table loading state', async () => {
    renderApp('/work-orders');

    fireEvent.click(screen.getByRole('button', { name: '작업 새로고침' }));

    const table = screen.getByRole('table', { name: '작업 요청 목록' });
    expect(within(table).getByRole('status')).toHaveTextContent(
      '작업 요청을 새로 불러오는 중입니다.',
    );

    await waitFor(() => expect(within(table).queryByRole('status')).toBeNull(), {
      timeout: 1000,
    });
  });

  it('changes theme and density without changing routes', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: '다크' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    const sidebar = screen.getByRole('complementary');
    await user.click(within(sidebar).getByRole('switch', { name: '컴팩트 밀도' }));
    expect(document.querySelector('.relay-app')).toHaveAttribute('data-density', 'compact');
    expect(window.location.pathname).toBe('/');

    await user.click(screen.getByRole('button', { name: '사용자 메뉴' }));
    expect(await screen.findByRole('menu')).toHaveAttribute('data-city-density', 'compact');
  });

  it('supports direct entry and browser history navigation', async () => {
    renderApp('/service-status/');

    expect(screen.getByRole('heading', { level: 1, name: '서비스 상태' })).toBeVisible();
    expect(screen.getByRole('link', { name: '서비스 상태' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(document.title).toBe('서비스 상태 · Relay');

    window.history.pushState(null, '', '/crews');
    fireEvent(window, new PopStateEvent('popstate'));

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1, name: '현장팀' })).toBeVisible(),
    );
    expect(screen.getByRole('link', { name: '현장팀' })).toHaveAttribute('aria-current', 'page');
  });

  it.each([
    ['/assets', '시설 자산', 'table', '시설 자산 목록'],
    ['/maintenance', '정비 계획', 'heading', '예정된 정비'],
    ['/reports', '운영 리포트', 'table', '권역별 운영 리포트'],
    ['/activity', '활동 기록', 'table', 'Relay 활동 기록'],
  ] as const)(
    'renders the %s route and its primary content',
    (path, heading, contentRole, contentName) => {
      renderApp(path);

      expect(screen.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      expect(screen.getByRole('link', { name: heading })).toHaveAttribute('aria-current', 'page');
      expect(screen.getByRole(contentRole, { name: contentName })).toBeVisible();
    },
  );

  it('filters assets and returns focus after closing asset details', async () => {
    const user = userEvent.setup();
    renderApp('/assets');

    await user.type(screen.getByRole('searchbox', { name: '시설 자산 검색' }), '배수');
    const table = screen.getByRole('table', { name: '시설 자산 목록' });
    expect(within(table).getByText('AS-0529')).toBeVisible();
    expect(within(table).queryByText('AS-1042')).toBeNull();

    const trigger = within(table).getByRole('button', {
      name: 'AS-0529 배수 펌프 1호기 자산 상세 보기',
    });
    await user.click(trigger);
    const details = screen.getByRole('dialog', { name: '배수 펌프 1호기' });
    expect(within(details).getByText('운영 중단')).toBeVisible();
    expect(within(details).getByText('34%')).toBeVisible();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('prioritizes stopped and inspection-needed assets in the default list', () => {
    renderApp('/assets');

    const table = screen.getByRole('table', { name: '시설 자산 목록' });
    const rows = within(table).getAllByRole('row');
    expect(rows[1]).toHaveTextContent('AS-0529');
    expect(rows[2]).toHaveTextContent('AS-0874');
    expect(rows[3]).toHaveTextContent('AS-0988');
    const stoppedAsset = within(table).getByRole('button', {
      name: 'AS-0529 배수 펌프 1호기 자산 상세 보기',
    });
    expect(within(stoppedAsset).getByText('운영 중단')).toBeVisible();
    expect(within(stoppedAsset).getByText('건강도 34%')).toBeVisible();
  });

  it('validates and creates a maintenance plan in memory', async () => {
    const user = userEvent.setup();
    renderApp('/maintenance');

    await user.click(screen.getByRole('button', { name: '정비 계획 추가' }));
    const dialog = screen.getByRole('dialog', { name: '새 정비 계획' });
    await user.click(within(dialog).getByRole('button', { name: '계획 추가' }));
    expect(within(dialog).getByText('제목을 입력하십시오.')).toBeVisible();

    await user.type(within(dialog).getByRole('textbox', { name: '계획 제목' }), '배수 펌프 재점검');
    await user.type(within(dialog).getByRole('textbox', { name: '대상 자산' }), '배수 펌프 1호기');
    await user.click(within(dialog).getByRole('combobox', { name: '시설 위치' }));
    await user.click(await screen.findByRole('option', { name: '을지로 지하보도' }));
    await user.type(within(dialog).getByRole('textbox', { name: '정비 일정' }), '7월 31일 · 09:00');
    await user.click(within(dialog).getByRole('button', { name: '계획 추가' }));

    expect(screen.queryByRole('dialog', { name: '새 정비 계획' })).toBeNull();
    expect(screen.getByText('배수 펌프 재점검')).toBeVisible();
    expect(screen.getByRole('dialog', { name: '정비 계획을 추가했습니다' })).toBeVisible();
  });

  it('updates report metrics with period and district controls', async () => {
    const user = userEvent.setup();
    renderApp('/reports');

    expect(screen.getByText('72건')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '오늘' }));
    expect(screen.getByText('40건')).toBeVisible();

    await user.click(screen.getByRole('combobox', { name: '리포트 권역' }));
    await user.click(await screen.findByRole('option', { name: '성동구' }));
    expect(screen.getByText('13건', { selector: '.relay-metric strong' })).toBeVisible();
    expect(screen.getByRole('progressbar', { name: 'SLA 준수율 92.3%' })).toBeVisible();
  });

  it('filters activity logs and exposes recorded before and after values', async () => {
    const user = userEvent.setup();
    renderApp('/activity');

    const table = screen.getByRole('table', { name: 'Relay 활동 기록' });
    await user.type(screen.getByRole('searchbox', { name: '활동 기록 검색' }), 'WO-2841');
    expect(within(table).getAllByText('WO-2841')).toHaveLength(2);

    const detailTrigger = within(table).getByRole('button', { name: 'EV-8421 변경 상세' });
    await user.click(detailTrigger);
    expect(screen.getByText('미배정')).toBeVisible();
    expect(screen.getByText('시설 전기팀')).toBeVisible();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(detailTrigger).toHaveFocus());
    await user.clear(screen.getByRole('searchbox', { name: '활동 기록 검색' }));
    await user.click(screen.getByRole('switch', { name: '시스템 이벤트 포함' }));
    expect(within(table).queryByText('EV-8418')).toBeNull();
  });

  it('uses one filter and table-detail contract across list pages', async () => {
    const { rerender } = renderApp('/assets');

    expect(screen.getByRole('group', { name: '시설 자산 필터' })).toBeVisible();
    const assetTable = screen.getByRole('table', { name: '시설 자산 목록' });
    expect(within(assetTable).queryByRole('button', { name: /메뉴/ })).toBeNull();
    expect(screen.getByRole('region', { name: '시설 자산 가로 스크롤 영역' })).toHaveAttribute(
      'aria-describedby',
      'asset-table-scroll-hint',
    );

    window.history.replaceState(null, '', '/activity');
    rerender(<App />);
    fireEvent(window, new PopStateEvent('popstate'));

    const activityTable = await screen.findByRole('table', { name: 'Relay 활동 기록' });
    expect(screen.getByRole('group', { name: '활동 기록 필터' })).toBeVisible();
    expect(within(activityTable).queryByRole('button', { name: /메뉴/ })).toBeNull();
    expect(within(activityTable).getByRole('button', { name: 'EV-8421 변경 상세' })).toBeVisible();
  });

  it('uses the same dialog footer contract for creation flows', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: '새 작업 만들기' }));
    expect(
      screen
        .getByRole('dialog', { name: '새 작업 요청' })
        .querySelector('[data-city-dialog-footer]'),
    ).not.toBeNull();
    await user.keyboard('{Escape}');

    await user.click(screen.getByRole('link', { name: '정비 계획' }));
    await user.click(screen.getByRole('button', { name: '정비 계획 추가' }));
    expect(
      screen
        .getByRole('dialog', { name: '새 정비 계획' })
        .querySelector('[data-city-dialog-footer]'),
    ).not.toBeNull();
  });

  it('recovers from an unknown route', async () => {
    const user = userEvent.setup();
    renderApp('/missing');

    expect(
      screen.getByRole('heading', { level: 1, name: '페이지를 찾을 수 없습니다' }),
    ).toBeVisible();
    expect(screen.queryByRole('link', { current: 'page' })).toBeNull();

    await user.click(screen.getByRole('button', { name: '운영 현황 보기' }));

    expect(window.location.pathname).toBe('/');
    expect(screen.getByRole('heading', { level: 1, name: '운영 현황' })).toBeVisible();
  });
});
