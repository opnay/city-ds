import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderDocs } from '../test/render-docs';
import { PlanSelection, examplePlans } from './examples/plan-selection';
import { SubscriptionManagement } from './examples/subscription-management';

const subscription = {
  status: 'active' as const,
  plan: 'Pro',
  price: '월 29,000원',
  renewalDate: '2026년 10월 8일',
  accessUntil: '2026년 10월 7일',
};

describe('subscription blocks', () => {
  it('exposes both subscription blocks in navigation and links to their sources', async () => {
    const user = userEvent.setup();
    await renderDocs(['/blocks/plan-selection']);
    const navigation = within(screen.getByRole('navigation', { name: '문서 탐색' }));
    expect(navigation.getByRole('button', { name: '구독·결제' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await user.click(navigation.getByRole('link', { name: '구독 관리' }));
    expect(await screen.findByRole('heading', { level: 1, name: '구독 관리' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: '코드 보기' }));
    expect(await screen.findByText('subscription-management.tsx', { exact: true })).toBeVisible();
  });

  it('submits the selected yearly plan and allows retry after failure', async () => {
    const user = userEvent.setup();
    const proceed = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue(undefined);
    render(
      <PlanSelection
        plans={examplePlans}
        current={{ planId: 'free', cycle: 'monthly' }}
        onContinue={proceed}
      />,
    );
    expect(screen.getByRole('button', { name: '선택한 플랜으로 계속' })).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: 'PRO' }));
    await user.click(screen.getByText('연간', { exact: true }));
    expect(screen.getByText(/매년 290,000원을 한 번에/)).toBeVisible();
    expect(proceed).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: '선택한 플랜으로 계속' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('다시 시도');
    await user.click(screen.getByRole('button', { name: '선택한 플랜으로 계속' }));
    expect(proceed).toHaveBeenLastCalledWith({ planId: 'pro', cycle: 'yearly' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('confirms the end date before cancellation and keeps the dialog on failure', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockRejectedValue(new Error('offline'));
    render(
      <SubscriptionManagement
        subscription={subscription}
        planSelectionHref="/blocks/plan-selection"
        onAction={action}
      />,
    );
    await user.click(screen.getByRole('button', { name: '해지 예약' }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/2026년 10월 7일까지/)).toBeVisible();
    expect(action).not.toHaveBeenCalled();
    await user.click(within(dialog).getByRole('button', { name: '해지 예약' }));
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('다시 시도');
    expect(screen.getByText('구독 중', { exact: true })).toBeVisible();
  });

  it('blocks duplicate payment retries while the request is pending', async () => {
    const user = userEvent.setup();
    const action = vi.fn(() => new Promise<void>(() => {}));
    render(
      <SubscriptionManagement
        subscription={{ ...subscription, status: 'past-due' }}
        planSelectionHref="/blocks/plan-selection"
        onAction={action}
      />,
    );
    await user.dblClick(screen.getByRole('button', { name: '결제 다시 시도' }));
    expect(action).toHaveBeenCalledTimes(1);
    expect(action).toHaveBeenCalledWith('retry');
    expect(screen.getByRole('button', { name: '결제 중…' })).toBeDisabled();
  });
  it('uses a real link and returns focus to the cancellation trigger', async () => {
    const user = userEvent.setup();
    render(
      <SubscriptionManagement
        subscription={subscription}
        planSelectionHref="/blocks/plan-selection"
        onAction={vi.fn()}
      />,
    );
    expect(screen.getByRole('link', { name: '플랜 변경' })).toHaveAttribute(
      'href',
      '/blocks/plan-selection',
    );
    const trigger = screen.getByRole('button', { name: '해지 예약' });
    await user.click(trigger);
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: '닫기' }));
    await vi.waitFor(() => expect(trigger).toHaveFocus());
  });

  it('shows loading and empty content without an enabled submit action', () => {
    const props = { current: { planId: 'free', cycle: 'monthly' as const }, onContinue: vi.fn() };
    const { rerender } = render(<PlanSelection {...props} plans={[]} loading />);
    expect(screen.getByLabelText('플랜 불러오는 중')).toHaveAttribute('aria-busy', 'true');
    rerender(<PlanSelection {...props} plans={[]} />);
    expect(screen.getByText('선택할 수 있는 플랜이 없어요.')).toBeVisible();
    expect(screen.queryByRole('button', { name: '선택한 플랜으로 계속' })).not.toBeInTheDocument();
  });

  it('explains permission restrictions and blocks mutations', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(
      <SubscriptionManagement
        subscription={subscription}
        planSelectionHref="/blocks/plan-selection"
        onAction={action}
        canManage={false}
      />,
    );
    expect(screen.getByText('관리자만 구독을 변경할 수 있어요.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '해지 예약' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
  });
});
