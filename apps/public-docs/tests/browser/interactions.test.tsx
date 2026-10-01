import { render, screen, within } from '@testing-library/react';
import { page, userEvent } from 'vitest/browser';
import { Menu } from '@opnay/city-ds-react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

import AccordionSelectionExample from '../../src/docs/components/accordion/examples/selection';
import AlertDialogConfirmExample from '../../src/docs/components/alert-dialog/examples/confirm';
import AvatarUsageExample from '../../src/docs/components/avatar/examples/usage';
import DatePickerUsageExample from '../../src/docs/components/date-picker/examples/usage';
import DialogControlledExample from '../../src/docs/components/dialog/examples/controlled';
import GroupedExample from '../../src/docs/components/agent-activity/examples/grouped';
import PlansExample from '../../src/docs/components/selection-card/examples/plans';
import SettingsExample from '../../src/docs/components/selection-card/examples/settings';
import ScrollAreaBothAxesExample from '../../src/docs/components/scroll-area/examples/both-axes';

describe('documented browser interactions', () => {
  it('changes SelectionCard radio borders with selection and preserves keyboard navigation', async () => {
    render(<PlansExample />);
    const starter = screen.getByRole('radio', { name: 'Starter' });
    const card = starter.closest('label')!;
    const before = getComputedStyle(card).borderColor;

    await userEvent.click(page.getByText('무료', { exact: true }));
    expect(starter).toBeChecked();
    await expect.poll(() => getComputedStyle(card).borderColor).not.toBe(before);
    await userEvent.keyboard('[ArrowRight]');
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    await userEvent.click(page.getByText('별도 문의'), { force: true });
    expect(screen.getByRole('radio', { name: 'Enterprise' })).not.toBeChecked();
  });

  it('renders SelectionCard switch focus and disabled styles on the card', async () => {
    render(<SettingsExample />);
    const control = screen.getByRole('switch', { name: '활동 알림' });
    const card = control.closest('label')!;
    const before = getComputedStyle(card).borderColor;

    await userEvent.click(page.getByText('팀의 새로운 활동을 알림으로 받습니다.'));
    expect(control).toBeChecked();
    await expect.poll(() => getComputedStyle(card).borderColor).not.toBe(before);
    await userEvent.keyboard('[Space]');
    expect(control).not.toBeChecked();
    expect(card.matches(':has(:focus-visible)')).toBe(true);
    const locked = screen.getByRole('switch', { name: '보안 알림' });
    await userEvent.click(page.getByText('보안 알림', { exact: true }), { force: true });
    expect(locked).toBeChecked();
    expect(getComputedStyle(locked).opacity).toBe('1');
    expect(getComputedStyle(locked.closest('label')!).opacity).toBe('0.5');
  });

  it('uses grid transitions when Accordion panels expand', async () => {
    render(<AccordionSelectionExample />);
    const panel = screen.getByRole('region', { name: '개요' });
    const style = getComputedStyle(panel);

    expect(style.transitionProperty).toContain('grid-template-rows');
    expect(style.transitionDuration).toBe('0.16s');
    expect(style.transitionTimingFunction).toBe('ease-in-out');
    expect(getComputedStyle(panel.firstElementChild!).minHeight).toBe('0px');
    await userEvent.click(page.getByRole('button', { name: '담당자', exact: true }).first());
    await expect
      .element(page.getByRole('button', { name: '담당자', exact: true }).first())
      .toHaveAttribute('aria-expanded', 'true');
  });

  it('loads the documented Avatar image in a real browser', async () => {
    render(<AvatarUsageExample />);
    await expect.element(page.getByRole('img', { name: '김인섭의 프로필 사진' })).toBeVisible();
    const image = screen.getByRole('img', { name: '김인섭의 프로필 사진' }) as HTMLImageElement;
    expect(image.complete).toBe(true);
    expect(image.naturalWidth).toBeGreaterThan(0);
  });

  it('focuses Dialog content, passes accessibility checks while open, and restores focus on Escape', async () => {
    render(<DialogControlledExample />);
    const trigger = screen.getByRole('button', { name: 'MD 크기' });
    await userEvent.click(page.elementLocator(trigger));
    await expect.element(page.getByRole('dialog', { name: '프로젝트 세부 정보' })).toBeVisible();
    const dialog = screen.getByRole('dialog', { name: '프로젝트 세부 정보' });
    await expect.poll(() => dialog.contains(document.activeElement)).toBe(true);
    await Promise.all(
      document
        .getAnimations()
        .filter(({ effect }) => Number.isFinite(effect?.getComputedTiming().endTime))
        .map((animation) => animation.finished),
    );
    expect((await axe.run(dialog)).violations).toEqual([]);
    await userEvent.keyboard('[Escape]');
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
    await expect.element(page.elementLocator(trigger)).toHaveFocus();
  });

  it('returns focus after cancelling a controlled AlertDialog', async () => {
    render(<AlertDialogConfirmExample />);
    const trigger = screen.getByRole('button', { name: '프로젝트 삭제' });
    await userEvent.click(page.elementLocator(trigger));
    await expect.element(page.getByRole('alertdialog')).toBeVisible();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(page.getByRole('button', { name: '취소' }));
    await expect.element(page.getByRole('alertdialog')).not.toBeInTheDocument();
    await expect.element(page.elementLocator(trigger)).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('selects a DatePicker date with native keys and returns focus to the trigger', async () => {
    render(<DatePickerUsageExample />);
    const trigger = screen.getByRole('button', { name: '검토 날짜 달력 열기' });
    trigger.focus();
    await userEvent.keyboard('[Enter]');
    await expect.element(page.getByLabelText('검토 날짜 달력', { exact: true })).toBeVisible();
    await userEvent.keyboard('[ArrowRight][Enter]');
    await expect
      .element(page.getByRole('textbox', { name: '검토 날짜' }))
      .toHaveValue('2026-07-16');
    await expect.element(page.elementLocator(trigger)).toHaveFocus();
  });

  it('opens nested AgentActivity details from the documented summary', async () => {
    render(<GroupedExample />);
    await userEvent.click(page.getByRole('button', { name: /3개 파일을 검사했습니다/ }));
    await expect.element(page.getByRole('list', { name: '파일 검사 활동' })).toBeVisible();
    await userEvent.click(
      page.getByRole('button', { name: /package.json의 export를 확인했습니다/ }),
    );
    await expect.element(page.getByLabelText('package.json export')).toBeVisible();
  });

  it('keeps both ScrollArea tracks interactive and its corner transparent', async () => {
    const { container } = render(<ScrollAreaBothAxesExample />);
    const viewport = screen.getByLabelText('배포 이벤트 표');
    const root = container.querySelector('[data-city-scroll-area-root]')!;
    await expect.element(page.elementLocator(viewport)).toHaveAttribute('tabindex', '0');
    expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
    expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    await expect.poll(() => root.querySelector('[data-city-scroll-area-corner]')).not.toBeNull();
    await userEvent.hover(page.elementLocator(root));
    for (const orientation of ['vertical', 'horizontal']) {
      await expect
        .poll(() => root.querySelector(`[data-orientation="${orientation}"]`))
        .toHaveAttribute('data-hovering', '');
    }
    expect(
      getComputedStyle(root.querySelector('[data-city-scroll-area-corner]')!).backgroundColor,
    ).toBe('rgba(0, 0, 0, 0)');
  });

  it('keeps a long Menu scroll indicator over the popup edges', async () => {
    render(
      <Menu.Root>
        <Menu.Trigger>모든 작업</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.ScrollUpIndicator data-testid="menu-scroll-up" />
              {Array.from({ length: 32 }, (_, index) => (
                <Menu.Item key={index}>작업 {index + 1}</Menu.Item>
              ))}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>,
    );
    await userEvent.click(page.getByRole('button', { name: '모든 작업' }));
    await expect.element(page.getByRole('menu')).toBeVisible();
    const menu = screen.getByRole('menu');
    const indicator = within(menu).getByTestId('menu-scroll-up');
    expect(menu.scrollHeight).toBeGreaterThan(menu.clientHeight);
    expect(indicator).not.toHaveAttribute('data-visible');
    menu.scrollTop = 64;
    await expect.poll(() => indicator).toHaveAttribute('data-visible');
    const surface = indicator.firstElementChild!.getBoundingClientRect();
    const bounds = menu.getBoundingClientRect();
    const style = getComputedStyle(menu);
    expect(surface.top).toBeLessThanOrEqual(bounds.top + Number.parseFloat(style.borderTopWidth));
    expect(surface.left).toBeLessThanOrEqual(
      bounds.left + Number.parseFloat(style.borderLeftWidth),
    );
    expect(surface.right).toBeGreaterThanOrEqual(
      bounds.right - Number.parseFloat(style.borderRightWidth),
    );
    expect(within(menu).getAllByRole('menuitem')).toHaveLength(32);
    menu.scrollTop = 0;
    await expect.poll(() => indicator).not.toHaveAttribute('data-visible');
  });
});
