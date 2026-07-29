import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, Button, type AlertVariant } from '@opnay/city-ds-react';

interface AlertStoryArgs {
  showIcon: boolean;
  variant: AlertVariant;
}

function AlertExample({ showIcon, variant }: AlertStoryArgs) {
  return (
    <Alert.Root className="w-96" showIcon={showIcon} variant={variant}>
      <Alert.Title>Dataset synced</Alert.Title>
      <Alert.Description>
        The latest city records are available in your workspace.
      </Alert.Description>
    </Alert.Root>
  );
}

const meta = {
  title: 'Feedback/Alert',
  component: AlertExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '페이지 안에서 유지되는 정보·성공·경고·오류 메시지를 제목, 설명, 선택적 아이콘과 액션으로 표시합니다.',
      },
    },
  },
  argTypes: {
    showIcon: { control: 'boolean' },
    variant: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] },
  },
  args: {
    showIcon: true,
    variant: 'info',
  },
  render: (args) => <AlertExample {...args} />,
} satisfies Meta<AlertStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="grid w-96 gap-3">
      {(['info', 'success', 'warning', 'error'] as const).map((variant) => (
        <Alert.Root key={variant} {...args} variant={variant}>
          <Alert.Title>{variant} message</Alert.Title>
          <Alert.Description>This alert demonstrates the {variant} variant.</Alert.Description>
        </Alert.Root>
      ))}
    </div>
  ),
};

export const TonesAndAppearances: Story = {
  render: () => (
    <div className="grid w-96 gap-3">
      <Alert.Root tone="neutral">
        <Alert.Title>Scheduled update</Alert.Title>
        <Alert.Description>Maintenance starts tonight at 23:00.</Alert.Description>
      </Alert.Root>
      <Alert.Root appearance="outline" tone="info">
        <Alert.Title>New dataset available</Alert.Title>
      </Alert.Root>
      <Alert.Root tone="success">
        <Alert.Title>Sync complete</Alert.Title>
      </Alert.Root>
      <Alert.Root tone="warning">
        <Alert.Title>Review required</Alert.Title>
      </Alert.Root>
      <Alert.Root tone="destructive">
        <Alert.Title>Import failed</Alert.Title>
      </Alert.Root>
    </div>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <Alert.Root {...args} className="w-96">
      <Alert.Title>Import paused</Alert.Title>
      <Alert.Description>
        Resolve the field mapping before importing the remaining rows.
      </Alert.Description>
      <Alert.Action>
        <Button size="sm">Review mapping</Button>
      </Alert.Action>
    </Alert.Root>
  ),
};

export const LongContent: Story = {
  render: (args) => (
    <Alert.Root {...args} className="w-96" variant="warning">
      <Alert.Title>Some records need attention</Alert.Title>
      <Alert.Description>
        We found rows with missing district codes, duplicated parcel identifiers, and dates outside
        the configured reporting period. Review the validation report before publishing this
        dataset.
      </Alert.Description>
    </Alert.Root>
  ),
};

export const WithoutIcon: Story = {
  args: { showIcon: false, variant: 'success' },
};
