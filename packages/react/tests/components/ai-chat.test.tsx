import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AgentActivity, Button, Commentary, DensityProvider } from '../../src';
import { Commentary as CommentarySubpath } from '../../src/components/commentary';
import { AgentActivity as AgentActivitySubpath } from '../../src/components/agent-activity';

function ToolActivity(props: React.ComponentProps<typeof AgentActivity.Root>) {
  return (
    <AgentActivity.Root {...props} data-testid="activity">
      <AgentActivity.Trigger>
        <AgentActivity.Indicator />
        <AgentActivity.Content>Read file</AgentActivity.Content>
        <AgentActivity.Meta>Now</AgentActivity.Meta>
      </AgentActivity.Trigger>
      <AgentActivity.Details data-testid="details">Tool result</AgentActivity.Details>
    </AgentActivity.Root>
  );
}

describe('AI chat composition', () => {
  it('exposes the same parts through root and subpath modules', () => {
    expect(Commentary).toBe(CommentarySubpath);
    expect(AgentActivity).toBe(AgentActivitySubpath);
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
        <Commentary.Root density="comfortable" data-testid="override" />
        <AgentActivity.Root density="comfortable" data-testid="activity-override" />
      </DensityProvider>,
    );
    for (const id of ['message', 'activity'])
      expect(screen.getByTestId(id)).toHaveAttribute('data-city-density', 'compact');
    for (const id of ['override', 'activity-override'])
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

describe('AgentActivity disclosure', () => {
  it('uses Base UI keyboard disclosure and preserves an uncontrolled choice while pending changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ToolActivity pending={false} />);
    const trigger = screen.getByRole('button', { name: /Read file/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Tool result')).not.toBeInTheDocument();
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByTestId('details')).toBeVisible();
    expect(trigger.getAttribute('aria-controls')).toBe(screen.getByTestId('details').id);
    rerender(<ToolActivity pending />);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveFocus();
    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('honors defaultOpen and externally controlled disclosure without adding a surface', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { rerender, unmount } = render(<ToolActivity open={false} onOpenChange={change} />);
    await user.click(screen.getByRole('button', { name: /Read file/ }));
    expect(change).toHaveBeenCalledWith(true, expect.objectContaining({ reason: 'trigger-press' }));
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    rerender(<ToolActivity open onOpenChange={change} />);
    expect(screen.getByText('Tool result')).toBeVisible();
    expect(screen.getByTestId('activity')).not.toHaveClass('border');
    expect(screen.getByTestId('details')).not.toHaveClass('border');
    unmount();
    render(<ToolActivity defaultOpen />);
    expect(screen.getByText('Tool result')).toBeVisible();
  });

  it('keeps static activities noninteractive and hides decorative disclosure icons', () => {
    render(
      <AgentActivity.Root>
        <AgentActivity.Indicator />
        <AgentActivity.Content>Model changed</AgentActivity.Content>
        <AgentActivity.Meta>Now</AgentActivity.Meta>
      </AgentActivity.Root>,
    );
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Model changed').tagName).toBe('SPAN');
  });

  it('groups sequential activities under a summary without changing the row start position', async () => {
    const user = userEvent.setup();
    render(
      <AgentActivity.Root data-testid="summary">
        <AgentActivity.Trigger>
          <AgentActivity.Indicator />
          <AgentActivity.Content>3개 파일을 검사했습니다.</AgentActivity.Content>
          <AgentActivity.Meta>Now</AgentActivity.Meta>
        </AgentActivity.Trigger>
        <AgentActivity.Details>
          <AgentActivity.List aria-label="파일 검사 활동">
            <AgentActivity.Root data-testid="first-child">
              <AgentActivity.Indicator />
              <AgentActivity.Content>README.md를 읽었습니다.</AgentActivity.Content>
            </AgentActivity.Root>
            <AgentActivity.Root>
              <AgentActivity.Trigger>
                <AgentActivity.Indicator />
                <AgentActivity.Content>package.json을 읽었습니다.</AgentActivity.Content>
              </AgentActivity.Trigger>
              <AgentActivity.Details>패키지 메타데이터</AgentActivity.Details>
            </AgentActivity.Root>
          </AgentActivity.List>
        </AgentActivity.Details>
      </AgentActivity.Root>,
    );

    const summary = screen.getByRole('button', { name: /3개 파일을 검사했습니다/ });
    expect(summary).not.toHaveClass('px-2');
    expect(screen.queryByRole('list', { name: '파일 검사 활동' })).toBeNull();

    await user.click(summary);
    expect(screen.getByRole('list', { name: '파일 검사 활동' })).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByTestId('first-child')).toHaveAttribute('role', 'listitem');
    expect(screen.getByTestId('first-child')).not.toHaveClass('px-2');

    await user.click(screen.getByRole('button', { name: /package.json을 읽었습니다/ }));
    expect(screen.getByText('패키지 메타데이터')).toBeVisible();
  });
});
