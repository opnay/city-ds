import { useId } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Checkbox, RadioGroup, SelectionCard, Switch } from '@opnay/city-ds-react';

function PlanCards({ disabled = false }: { disabled?: boolean }) {
  const id = useId();
  return (
    <RadioGroup
      aria-label="Plan"
      name="plan"
      defaultValue="starter"
      disabled={disabled}
      className="w-full max-w-3xl gap-3 sm:grid-cols-3"
    >
      {[
        { value: 'starter', title: 'Starter', description: 'For personal projects', price: 'Free' },
        { value: 'pro', title: 'Pro', description: 'For growing teams', price: '$29 / month' },
        {
          value: 'enterprise',
          title: 'Enterprise',
          description: 'Organization-wide controls · Coming soon',
          price: 'Contact us',
          disabled: true,
        },
      ].map((plan) => (
        <SelectionCard key={plan.value}>
          <SelectionCard.Content>
            <SelectionCard.Title id={`${id}-${plan.value}-title`}>{plan.title}</SelectionCard.Title>
            <SelectionCard.Description id={`${id}-${plan.value}-description`}>
              {plan.description}
            </SelectionCard.Description>
            <span className="mt-3 text-lg font-semibold">{plan.price}</span>
          </SelectionCard.Content>
          <RadioGroup.Control
            value={plan.value}
            disabled={plan.disabled}
            aria-labelledby={`${id}-${plan.value}-title`}
            aria-describedby={`${id}-${plan.value}-description`}
            className="mt-1"
          />
        </SelectionCard>
      ))}
    </RadioGroup>
  );
}

const meta = {
  title: 'Forms/Selection card',
  component: PlanCards,
  tags: ['autodocs'],
  argTypes: { disabled: { control: 'boolean' } },
} satisfies Meta<typeof PlanCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plans: Story = {
  render: (args) => <PlanCards {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pro = canvas.getByRole('radio', { name: 'Pro' });
    const card = pro.closest('label')!;
    const before = getComputedStyle(card).borderColor;
    await userEvent.click(canvas.getByText('$29 / month'));
    await expect(pro).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Starter' })).not.toBeChecked();
    await expect(pro).toHaveAccessibleDescription('For growing teams');
    await waitFor(() => expect(getComputedStyle(card).borderColor).not.toBe(before));
    await userEvent.keyboard('[ArrowLeft]');
    await expect(canvas.getByRole('radio', { name: 'Starter' })).toHaveFocus();
    await expect(canvas.getByRole('radio', { name: 'Starter' })).toBeChecked();
    await userEvent.click(canvas.getByText('Contact us'));
    await expect(canvas.getByRole('radio', { name: 'Enterprise' })).not.toBeChecked();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const CheckboxStates: Story = {
  render: function CheckboxCards() {
    const id = useId();
    return (
      <div className="grid w-full max-w-md gap-3">
        {[
          { label: 'Daily backup', defaultChecked: true },
          { label: 'Usage analytics' },
          { label: 'Some environments selected', indeterminate: true },
          { label: 'Managed by your organization', defaultChecked: true, disabled: true },
        ].map(({ label, ...props }, index) => (
          <SelectionCard key={label}>
            <Checkbox
              {...props}
              aria-labelledby={`${id}-${index}-title`}
              aria-describedby={`${id}-${index}-description`}
              className="mt-1"
            />
            <SelectionCard.Content>
              <SelectionCard.Title id={`${id}-${index}-title`}>{label}</SelectionCard.Title>
              <SelectionCard.Description id={`${id}-${index}-description`}>
                Settings apply to the selected workspace.
              </SelectionCard.Description>
            </SelectionCard.Content>
          </SelectionCard>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const analytics = canvas.getByRole('checkbox', { name: 'Usage analytics' });
    await userEvent.click(canvas.getByText('Usage analytics'));
    await expect(analytics).toBeChecked();
    await userEvent.keyboard('[Space]');
    await expect(analytics).not.toBeChecked();
    await userEvent.click(canvas.getByText('Managed by your organization'));
    await expect(
      canvas.getByRole('checkbox', { name: 'Managed by your organization' }),
    ).toBeChecked();
  },
};

export const SwitchSettings: Story = {
  render: function SwitchCards() {
    const id = useId();
    return (
      <div className="grid w-full max-w-md gap-3">
        {[
          { label: 'Activity notifications', description: 'Receive updates from your team.' },
          {
            label: 'Security alerts',
            description: 'Managed by your organization.',
            defaultChecked: true,
            disabled: true,
          },
        ].map(({ label, description, ...props }, index) => (
          <SelectionCard key={label}>
            <SelectionCard.Content>
              <SelectionCard.Title id={`${id}-${index}-title`}>{label}</SelectionCard.Title>
              <SelectionCard.Description id={`${id}-${index}-description`}>
                {description}
              </SelectionCard.Description>
            </SelectionCard.Content>
            <Switch
              {...props}
              aria-labelledby={`${id}-${index}-title`}
              aria-describedby={`${id}-${index}-description`}
              className="mt-1"
            />
          </SelectionCard>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('switch', { name: 'Activity notifications' });
    const card = control.closest('label')!;
    const before = getComputedStyle(card).borderColor;
    await userEvent.click(canvas.getByText('Receive updates from your team.'));
    await expect(control).toBeChecked();
    await waitFor(() => expect(getComputedStyle(card).borderColor).not.toBe(before));
    await userEvent.keyboard('[Space]');
    await expect(control).not.toBeChecked();
    await expect(card.matches(':has(:focus-visible)')).toBe(true);
    const locked = canvas.getByRole('switch', { name: 'Security alerts' });
    await userEvent.click(canvas.getByText('Security alerts'));
    await expect(locked).toBeChecked();
    await expect(getComputedStyle(locked).opacity).toBe('1');
    await expect(getComputedStyle(locked.closest('label')!).opacity).toBe('0.5');
  },
};
