import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { ScrollArea } from '@opnay/city-ds-react';

const EVENTS = [
  'Added the change to the build queue.',
  'Started type checking.',
  'Built the component package.',
  'Generated the public docs bundle.',
  'Completed the accessibility review.',
  'Prepared the preview deployment.',
  'Recorded the deployment event.',
  'Updated the release notes.',
] as const;

function EventContent({ bothAxes }: { bothAxes: boolean }) {
  return (
    <ScrollArea.Content className="p-4">
      <div
        className={bothAxes ? 'grid min-h-[24rem] min-w-[48rem] gap-2' : 'grid min-h-[24rem] gap-2'}
      >
        {EVENTS.map((event, index) => (
          <span
            className="rounded-city-sm border-city-border bg-city-surface p-2 text-sm"
            key={event}
          >
            {index + 1}. {event}
          </span>
        ))}
      </div>
    </ScrollArea.Content>
  );
}

function ScrollAreaExample({ bothAxes = false }: { bothAxes?: boolean }) {
  return (
    <ScrollArea.Root className="h-48 w-[min(32rem,calc(100vw-2rem))]">
      <ScrollArea.Viewport aria-label={bothAxes ? 'Deployment event table' : 'Deployment events'}>
        <EventContent bothAxes={bothAxes} />
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
      {bothAxes ? (
        <>
          <ScrollArea.Scrollbar orientation="horizontal">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </>
      ) : null}
    </ScrollArea.Root>
  );
}

const meta = {
  title: 'Layout/ScrollArea',
  component: ScrollAreaExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '한정된 영역에서 긴 목록이나 넓은 콘텐츠를 탐색합니다. 두 축이 넘치면 Corner는 스크롤바 교차를 분리하지만 시각적 사각형을 만들지 않습니다.',
      },
    },
  },
} satisfies Meta<typeof ScrollAreaExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => <ScrollAreaExample />,
};

export const BothAxes: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const viewport = canvas.getByLabelText('Deployment event table');
    const root = viewport.closest('[data-city-scroll-area-root]');

    if (!root) throw new Error('ScrollArea root was not rendered.');

    await expect(viewport).toHaveAttribute('tabindex', '0');
    await waitFor(() =>
      expect(root.querySelector('[data-city-scroll-area-corner]')).not.toBeNull(),
    );
    const corner = root.querySelector<HTMLElement>('[data-city-scroll-area-corner]');

    if (!corner) throw new Error('ScrollArea corner was not rendered.');

    await userEvent.hover(root);
    await expect(root.querySelector('[data-orientation="vertical"]')).toHaveAttribute(
      'data-hovering',
      '',
    );
    await expect(root.querySelector('[data-orientation="horizontal"]')).toHaveAttribute(
      'data-hovering',
      '',
    );
    await expect(getComputedStyle(corner).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  },
  render: () => <ScrollAreaExample bothAxes />,
};
