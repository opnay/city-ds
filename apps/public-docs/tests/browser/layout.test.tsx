import { render, screen } from '@testing-library/react';
import { Timeline } from '@opnay/city-ds-react';
import { describe, expect, it } from 'vitest';

import ContentExample from '../../src/docs/components/article/examples/content';
import MessageExample from '../../src/docs/components/commentary/examples/message';
import ActivityExample from '../../src/docs/components/agent-activity/examples/activity';
import DetailsExample from '../../src/docs/components/agent-activity/examples/details';
import EventsExample from '../../src/docs/components/agent-activity/examples/events';
import GroupedExample from '../../src/docs/components/agent-activity/examples/grouped';
import DataListDetailsExample from '../../src/docs/components/data-list/examples/details';
import ItemContentExample from '../../src/docs/components/item/examples/content';
import StepperSetupExample from '../../src/docs/components/stepper/examples/setup';
import TimelineActivityExample from '../../src/docs/components/timeline/examples/activity';

describe('documented browser layout', () => {
  it.each([640, 280])('adapts DataList to a %ipx container', (width) => {
    const { container } = render(
      <div style={{ width }}>
        <DataListDetailsExample orientation="horizontal" />
      </div>,
    );
    const label = screen.getByText('앱 이름').getBoundingClientRect();
    const value = screen.getByText('일정 도우미').getBoundingClientRect();
    const list = container.querySelector<HTMLElement>('dl')!;

    if (width > 384) {
      expect(value.left).toBeGreaterThan(label.left);
      expect(Math.abs(value.top - label.top)).toBeLessThan(2);
    } else {
      expect(value.top).toBeGreaterThan(label.top);
    }
    expect(list.clientWidth).toBeGreaterThan(0);
    expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
  });

  it.each(['comfortable', 'compact'] as const)(
    'connects Timeline events at %s density and hides the last connector',
    (density) => {
      const { container } = render(
        <div style={{ width: 480 }}>
          <TimelineActivityExample density={density} />
        </div>,
      );
      const items = container.querySelectorAll<HTMLElement>('[data-city-timeline-item]');
      const connectors = container.querySelectorAll<HTMLElement>('[data-city-timeline-connector]');
      const first = connectors[0]!.getBoundingClientRect();
      const next = items[1]!.getBoundingClientRect();

      expect(items).toHaveLength(3);
      expect(first.height).toBeGreaterThan(0);
      expect(Math.abs(first.bottom - next.top)).toBeLessThan(1);
      expect(items[0]!.getBoundingClientRect().height).toBeGreaterThan(24);
      expect(getComputedStyle(connectors[2]!).display).toBe('none');
    },
  );

  it('hides the connector for a single Timeline event', () => {
    const { container } = render(
      <Timeline.Root>
        <Timeline.Item>
          <Timeline.Indicator />
          <Timeline.Connector />
          <Timeline.Content>
            <Timeline.Title>프로젝트 생성</Timeline.Title>
          </Timeline.Content>
        </Timeline.Item>
      </Timeline.Root>,
    );
    expect(
      getComputedStyle(container.querySelector('[data-city-timeline-connector]')!).display,
    ).toBe('none');
  });

  it.each([
    { name: 'Article', Example: ContentExample, selector: '[data-city-article]' },
    { name: 'Commentary', Example: MessageExample, selector: '[data-city-commentary]' },
    { name: 'AgentActivity', Example: ActivityExample, selector: '[data-city-agent-activity]' },
    {
      name: 'AgentActivity events',
      Example: EventsExample,
      selector: '[data-city-agent-activity]',
    },
    {
      name: 'AgentActivity details',
      Example: DetailsExample,
      selector: '[data-city-agent-activity]',
    },
    {
      name: 'AgentActivity group',
      Example: GroupedExample,
      selector: '[data-city-agent-activity]',
    },
    { name: 'Item', Example: ItemContentExample, selector: '[data-city-item]' },
    { name: 'Stepper', Example: StepperSetupExample, selector: '[data-city-stepper]' },
    { name: 'Timeline', Example: TimelineActivityExample, selector: '[data-city-timeline]' },
  ])('keeps $name inside a narrow container', ({ Example, selector }) => {
    const { container } = render(
      <div style={{ width: 240 }}>
        <Example />
      </div>,
    );
    const roots = container.querySelectorAll<HTMLElement>(selector);

    expect(roots.length).toBeGreaterThan(0);
    for (const root of roots) {
      expect(root.clientWidth).toBeGreaterThan(0);
      expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
      for (const code of root.querySelectorAll('pre')) {
        expect(code.getBoundingClientRect().width).toBeLessThanOrEqual(root.clientWidth);
      }
    }
  });

  it('keeps horizontal Stepper indicators centered on one row', () => {
    const { container } = render(
      <div style={{ width: 240 }}>
        <StepperSetupExample />
      </div>,
    );
    const items = container.querySelectorAll<HTMLElement>('[data-city-stepper-item]');

    expect(items).toHaveLength(3);
    expect(items[0]!.getBoundingClientRect().top).toBe(items[1]!.getBoundingClientRect().top);
    for (const item of items) {
      const indicator = item.querySelector('[aria-hidden="true"]')!.getBoundingClientRect();
      const bounds = item.getBoundingClientRect();
      expect(
        Math.abs(indicator.left + indicator.width / 2 - bounds.left - bounds.width / 2),
      ).toBeLessThan(1);
    }
    expect(container.querySelector('[data-city-stepper]')).not.toHaveTextContent('City Web');
  });

  it('applies public content typography and prose flow in Chromium', () => {
    render(
      <article className="city-prose">
        <p className="city-text-body">앞 문단입니다.</p>
        <h2 className="city-text-section-title">운행 상태</h2>
        <p className="city-text-body">일반적인 본문입니다.</p>
        <footer className="city-text-caption">14:30 갱신</footer>
      </article>,
    );
    const title = getComputedStyle(screen.getByRole('heading', { name: '운행 상태' }));
    const body = getComputedStyle(screen.getByText('일반적인 본문입니다.'));
    const caption = getComputedStyle(screen.getByText('14:30 갱신'));
    const prose = getComputedStyle(document.querySelector('.city-prose')!);

    expect(prose.maxInlineSize).not.toBe('none');
    expect(prose.wordBreak).toBe('keep-all');
    expect(prose.gap).toBe('20px');
    expect(title.fontSize).toBe('24px');
    expect(title.lineHeight).toBe('32px');
    expect(title.fontWeight).toBe('600');
    expect(title.marginBlockStart).toBe('24px');
    expect(body.fontSize).toBe('16px');
    expect(body.lineHeight).toBe('28px');
    expect(caption.fontSize).toBe('12px');
    expect(caption.lineHeight).toBe('16px');
  });
});
