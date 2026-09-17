import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ACTIONED_STATUSES, Actioned } from '@opnay/city-ds-react';
import ToolExample from '../../../public-docs/src/docs/components/actioned/examples/tool';
import ControlledExample from '../../../public-docs/src/docs/components/actioned/examples/controlled';
import ConversationExample from '../../../public-docs/src/docs/components/actioned/examples/conversation';

const meta = {
  title: 'AI & Chat/Actioned',
  component: ToolExample,
  tags: ['autodocs'],
  args: { status: 'queued', density: 'comfortable', defaultOpen: false },
  argTypes: {
    status: { control: 'select', options: ACTIONED_STATUSES },
    density: { control: 'inline-radio', options: ['comfortable', 'compact'] },
    defaultOpen: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 560, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToolExample>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '프로젝트 파일 읽기' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(/도구 입력과 결과는/)).toBeVisible();
    await userEvent.keyboard(' ');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};
export const Compact: Story = {
  args: { density: 'compact', status: 'running', defaultOpen: true },
};
export const Statuses: Story = {
  render: () => (
    <div className="grid gap-3">
      {ACTIONED_STATUSES.map((status) => (
        <ToolExample key={status} status={status} />
      ))}
    </div>
  ),
};
export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: '검색 결과' });
    await userEvent.click(canvas.getByRole('button', { name: '외부에서 상세 열기' }));
    await userEvent.click(canvas.getByRole('button', { name: '상태 전환' }));
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('Completed')).toBeVisible();
  },
};
export const Narrow: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <Actioned.Root status="running" defaultOpen>
        <Actioned.Header>
          <Actioned.Trigger>
            read_file_with_a_very_long_unbroken_tool_name_0123456789
          </Actioned.Trigger>
          <Actioned.Status />
        </Actioned.Header>
        <Actioned.Content>
          <pre tabIndex={0} aria-label="Input">
            <code>{'{ "path": "packages/react/src/components/commentary/index.tsx" }'}</code>
          </pre>
        </Actioned.Content>
      </Actioned.Root>
      <ToolExample status="approval-required" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const root of canvasElement.querySelectorAll<HTMLElement>('[data-city-actioned]')) {
      await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    }
  },
};
export const Dark: Story = { ...Narrow, globals: { theme: 'dark' } };
export const Conversation: Story = {
  render: () => <ConversationExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '작업 시작' }));
    await expect(canvas.getByRole('button', { name: '승인 요청 보기' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const trigger = canvas.getByRole('button', { name: 'README.md 읽기' });
    await expect(trigger).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: '허용' }));
    await expect(canvas.getByText('실행 요청: 1회')).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(canvas.getByRole('button', { name: '성공 결과 적용' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('완료');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveFocus();
  },
};
