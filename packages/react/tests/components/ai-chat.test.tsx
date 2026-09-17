import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Actioned,
  ACTIONED_STATUSES,
  AgentActivity,
  Button,
  Commentary,
  DensityProvider,
  type ActionedRootProps,
} from '../../src';
import { Commentary as CommentarySubpath } from '../../src/components/commentary';
import { AgentActivity as AgentActivitySubpath } from '../../src/components/agent-activity';
import { Actioned as ActionedSubpath } from '../../src/components/actioned';

function Tool(props: ActionedRootProps) {
  return (
    <Actioned.Root {...props} data-testid="tool">
      <Actioned.Header>
        <Actioned.Trigger>Read file</Actioned.Trigger>
        <Actioned.Status />
      </Actioned.Header>
      <Actioned.Content data-testid="details">Tool result</Actioned.Content>
    </Actioned.Root>
  );
}

describe('AI chat composition', () => {
  it('exposes the same parts through root and subpath modules', () => {
    expect(Commentary).toBe(CommentarySubpath);
    expect(AgentActivity).toBe(AgentActivitySubpath);
    expect(Actioned).toBe(ActionedSubpath);
  });

  it('inherits density with local overrides and does not announce historical records', () => {
    const { container } = render(
      <DensityProvider density="compact">
        <Commentary.Root data-testid="message">
          <Commentary.Content>History</Commentary.Content>
        </Commentary.Root>
        <AgentActivity.Root data-testid="activity">
          <AgentActivity.Content>Model changed</AgentActivity.Content>
        </AgentActivity.Root>
        <Tool status="queued" />
        <Commentary.Root density="comfortable" data-testid="override" />
        <AgentActivity.Root density="comfortable" data-testid="activity-override" />
        <Actioned.Root status="completed" density="comfortable" data-testid="tool-override" />
      </DensityProvider>,
    );
    for (const id of ['message', 'activity', 'tool'])
      expect(screen.getByTestId(id)).toHaveAttribute('data-city-density', 'compact');
    for (const id of ['override', 'activity-override', 'tool-override'])
      expect(screen.getByTestId(id)).toHaveAttribute('data-city-density', 'comfortable');
    expect(
      container.querySelector('[aria-live], [role="status"], [role="log"], [role="alert"]'),
    ).toBeNull();
    expect(screen.getByTestId('message')).toHaveAttribute('data-city-appearance', 'plain');
    expect(screen.getByTestId('message')).toHaveAttribute('data-city-align', 'start');
    expect(screen.getByTestId('activity')).not.toHaveAttribute('data-city-pending');
  });

  it('merges render elements, refs, DOM props and event handlers', async () => {
    const user = userEvent.setup();
    const rootRef = React.createRef<HTMLDivElement>();
    const authorRef = React.createRef<HTMLSpanElement>();
    const click = vi.fn();
    const renderClick = vi.fn();
    render(
      <Commentary.Root
        ref={rootRef}
        render={<article data-testid="message" onClick={renderClick} />}
        onClick={click}
        appearance="bubble"
        align="end"
        className="consumer-message"
      >
        <Commentary.Header>
          <Commentary.Author ref={authorRef}>Assistant</Commentary.Author>
          <Commentary.Meta render={<time dateTime="2026-09-17" />}>Today</Commentary.Meta>
        </Commentary.Header>
        <Commentary.Content>
          <pre>
            <code>arbitrary content</code>
          </pre>
        </Commentary.Content>
        <Commentary.Actions>
          <Button>Copy</Button>
        </Commentary.Actions>
      </Commentary.Root>,
    );
    expect(screen.getByTestId('message')).toBe(rootRef.current);
    expect(rootRef.current?.tagName).toBe('ARTICLE');
    expect(rootRef.current).toHaveClass('consumer-message');
    expect(rootRef.current).toHaveAttribute('data-city-align', 'end');
    expect(rootRef.current).toHaveAttribute('data-city-appearance', 'bubble');
    expect(authorRef.current).toHaveTextContent('Assistant');
    expect(screen.getByText('Today')).toHaveAttribute('datetime', '2026-09-17');
    await user.tab();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledOnce();
    expect(renderClick).toHaveBeenCalledOnce();
  });

  it('lets consumers compose custom activity and opt into live updates', () => {
    const root = React.createRef<HTMLDivElement>();
    const indicator = React.createRef<HTMLSpanElement>();
    render(
      <AgentActivity.Root pending role="status" ref={root} render={<section />}>
        <AgentActivity.Indicator ref={indicator}>
          <svg data-testid="custom-icon" />
        </AgentActivity.Indicator>
        <AgentActivity.Content>Thinking</AgentActivity.Content>
        <AgentActivity.Meta>12 seconds</AgentActivity.Meta>
      </AgentActivity.Root>,
    );
    expect(screen.getByRole('status')).toBe(root.current);
    expect(root.current?.tagName).toBe('SECTION');
    expect(root.current).toHaveAttribute('data-city-pending');
    expect(indicator.current).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});

describe('Actioned', () => {
  it('uses Base UI keyboard disclosure and preserves uncontrolled open state through every status', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Tool status="queued" />);
    const trigger = screen.getByRole('button', { name: 'Read file' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Tool result')).not.toBeInTheDocument();
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('details')).toBeVisible();
    expect(trigger.getAttribute('aria-controls')).toBe(screen.getByTestId('details').id);
    for (const status of ACTIONED_STATUSES) {
      rerender(<Tool status={status} />);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByTestId('tool')).toHaveAttribute('data-city-status', status);
      expect(trigger).toHaveFocus();
    }
    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    rerender(<Tool status="queued" />);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('honors defaultOpen and externally controlled disclosure', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { rerender, unmount } = render(
      <Tool status="running" open={false} onOpenChange={change} />,
    );
    await user.click(screen.getByRole('button'));
    expect(change).toHaveBeenCalledWith(true, expect.objectContaining({ reason: 'trigger-press' }));
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    rerender(<Tool status="completed" open onOpenChange={change} />);
    expect(screen.getByText('Tool result')).toBeVisible();
    unmount();
    render(<Tool status="completed" defaultOpen />);
    expect(screen.getByText('Tool result')).toBeVisible();
  });

  it('keeps approval visible outside the closed panel and leaves execution policy to the consumer', async () => {
    const user = userEvent.setup();
    const approve = vi.fn();
    const openChange = vi.fn();
    const trigger = React.createRef<HTMLButtonElement>();
    const approval = React.createRef<HTMLDivElement>();
    render(
      <Actioned.Root status="approval-required" onOpenChange={openChange} data-testid="tool">
        <Actioned.Header>
          <Actioned.Trigger ref={trigger} render={<button data-testid="trigger" />}>
            Details
          </Actioned.Trigger>
          <Actioned.Status>승인 필요</Actioned.Status>
        </Actioned.Header>
        <Actioned.Content>Hidden details</Actioned.Content>
        <Actioned.Approval ref={approval} render={<section data-testid="approval" />}>
          <p>Read this file?</p>
          <Actioned.Actions>
            <Button onClick={approve}>Allow</Button>
            <Button>Reject</Button>
          </Actioned.Actions>
        </Actioned.Approval>
      </Actioned.Root>,
    );
    expect(screen.getByTestId('approval')).toBe(approval.current);
    expect(approval.current).toBeVisible();
    expect(screen.getByTestId('trigger')).toBe(trigger.current);
    await user.tab();
    await user.tab();
    await user.keyboard('{Enter}');
    expect(approve).toHaveBeenCalledOnce();
    expect(openChange).not.toHaveBeenCalled();
    expect(screen.getByTestId('tool')).toHaveAttribute('data-city-status', 'approval-required');
    expect(screen.getByText('승인 필요')).toBeVisible();
    expect(trigger.current).toHaveAttribute('aria-expanded', 'false');
  });

  it.each([
    ['queued', 'Queued'],
    ['approval-required', 'Approval required'],
    ['running', 'Running'],
    ['completed', 'Completed'],
    ['failed', 'Failed'],
    ['cancelled', 'Cancelled'],
    ['rejected', 'Rejected'],
  ] as const)('labels %s without requiring color or live semantics', (status, label) => {
    render(<Tool status={status} />);
    expect(screen.getByText(label)).toBeVisible();
    expect(screen.getByText(label).parentElement?.querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
