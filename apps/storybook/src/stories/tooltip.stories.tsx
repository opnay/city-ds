import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from '@city-ds/react';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tooltip.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function TooltipExample({
  side = 'top',
  defaultOpen = false,
}: {
  side?: 'top' | 'right' | 'bottom' | 'left';
  defaultOpen?: boolean;
}) {
  return (
    <Tooltip.Provider delay={0} closeDelay={0}>
      <Tooltip.Root defaultOpen={defaultOpen}>
        <Tooltip.Trigger aria-label="Show deployment details">Deployment</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side={side} sideOffset={8}>
            <Tooltip.Popup>
              Production deployments require an approved change request.
              <Tooltip.Arrow />
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export const Default: Story = {
  render: () => <TooltipExample />,
};

export const Open: Story = {
  render: () => <TooltipExample defaultOpen />,
};

export const RightAligned: Story = {
  render: () => <TooltipExample side="right" />,
};
