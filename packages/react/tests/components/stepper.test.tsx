import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Stepper } from '../../src/components/stepper';

function Steps({ current = true, status = 'error' as 'error' | 'completed' }) {
  return (
    <Stepper.Root aria-label="설정 단계">
      <Stepper.Item
        current={current}
        status={status}
        statusLabel={status === 'error' ? '확인 필요' : '완료'}
      >
        <Stepper.Indicator>1</Stepper.Indicator>
        <Stepper.Content>
          <Stepper.Title>연결</Stepper.Title>
          <Stepper.Description>연결 정보를 확인하십시오.</Stepper.Description>
        </Stepper.Content>
      </Stepper.Item>
    </Stepper.Root>
  );
}

describe('Stepper', () => {
  it('uses an ordered list and exposes current and error states independently', () => {
    const { rerender } = render(<Steps />);
    expect(screen.getByRole('list', { name: '설정 단계' }).tagName).toBe('OL');
    const item = screen.getByRole('listitem');
    expect(item).toHaveAttribute('aria-current', 'step');
    expect(item).toHaveAttribute('data-status', 'error');
    expect(screen.getByText('확인 필요')).toHaveClass('sr-only');
    expect(item.querySelector('[aria-hidden="true"]')).toContainHTML('svg');
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    rerender(<Steps current={false} status="completed" />);
    expect(item).not.toHaveAttribute('aria-current');
    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it('renders completed-step summaries only in vertical orientation', () => {
    const example = (orientation: 'horizontal' | 'vertical') => (
      <Stepper.Root orientation={orientation}>
        <Stepper.Item status="completed">
          <Stepper.Indicator>1</Stepper.Indicator>
          <Stepper.Content>
            <Stepper.Title>설정</Stepper.Title>
            <Stepper.Description>필수 설정 안내</Stepper.Description>
          </Stepper.Content>
        </Stepper.Item>
      </Stepper.Root>
    );
    const { rerender } = render(example('horizontal'));
    expect(screen.queryByText('필수 설정 안내')).not.toBeInTheDocument();
    rerender(example('vertical'));
    expect(screen.getByText('필수 설정 안내')).toBeVisible();
    rerender(example('horizontal'));
    expect(screen.queryByText('필수 설정 안내')).not.toBeInTheDocument();
  });

  it('omits current and future summaries even when description children are supplied', () => {
    render(
      <Stepper.Root orientation="vertical">
        <Stepper.Item status="completed">
          <Stepper.Description>저장한 프로젝트 이름</Stepper.Description>
        </Stepper.Item>
        <Stepper.Item current status="completed">
          <Stepper.Description>현재 작업 안내</Stepper.Description>
        </Stepper.Item>
        <Stepper.Item>
          <Stepper.Description>다음 작업 안내</Stepper.Description>
        </Stepper.Item>
      </Stepper.Root>,
    );
    expect(screen.getByText('저장한 프로젝트 이름')).toBeVisible();
    expect(screen.queryByText('현재 작업 안내')).not.toBeInTheDocument();
    expect(screen.queryByText('다음 작업 안내')).not.toBeInTheDocument();
  });

  it('supports native keyboard actions, disabled steps and does not submit a containing form', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <Stepper.Root>
          <Stepper.Item>
            <Stepper.Content>
              <Stepper.Trigger onClick={click}>기본 정보</Stepper.Trigger>
            </Stepper.Content>
          </Stepper.Item>
          <Stepper.Item>
            <Stepper.Content>
              <Stepper.Trigger disabled onClick={click}>
                배포
              </Stepper.Trigger>
            </Stepper.Content>
          </Stepper.Item>
        </Stepper.Root>
      </form>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: '기본 정보' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(click).toHaveBeenCalledTimes(2);
    await user.click(screen.getByRole('button', { name: '배포' }));
    expect(click).toHaveBeenCalledTimes(2);
    expect(submit).not.toHaveBeenCalled();
  });

  it('forwards refs and composes router links while preserving consumer props', () => {
    const ref = React.createRef<HTMLOListElement>();
    render(
      <Stepper.Root ref={ref} orientation="vertical" render={<ol data-consumer="steps" />}>
        <Stepper.Item>
          <Stepper.Content>
            <Stepper.Trigger nativeButton={false} role="link" render={<a href="#details" />}>
              정보 수정
            </Stepper.Trigger>
          </Stepper.Content>
        </Stepper.Item>
      </Stepper.Root>,
    );
    expect(ref.current).toHaveAttribute('data-consumer', 'steps');
    expect(ref.current).toHaveAttribute('data-orientation', 'vertical');
    expect(screen.getByRole('link', { name: '정보 수정' })).toHaveAttribute('href', '#details');
  });
});
