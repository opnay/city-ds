import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { Field, OtpInput, type OtpInputRootProps } from '@opnay/city-ds-react';

type Props = Pick<
  OtpInputRootProps,
  'length' | 'size' | 'mask' | 'disabled' | 'readOnly' | 'validationType'
> & { invalid?: boolean };

function CodeInput({ invalid = false, disabled = false, ...props }: Props) {
  return (
    <Field.Root invalid={invalid} disabled={disabled}>
      <Field.Label>Verification code</Field.Label>
      <OtpInput.Root {...props} />
      <Field.Description>Enter the code from your email.</Field.Description>
      {invalid && <Field.Error match>Check the code and try again.</Field.Error>}
    </Field.Root>
  );
}

const meta = {
  title: 'Forms/Otp input',
  component: CodeInput,
  tags: ['autodocs'],
  argTypes: {
    length: { control: 'inline-radio', options: [4, 6, 8] },
    size: { control: 'inline-radio', options: ['xsm', 'sm', 'md', 'lg', 'xlg'] },
    validationType: { control: 'inline-radio', options: ['numeric', 'alphanumeric'] },
    mask: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
} satisfies Meta<typeof CodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    const inputs = canvas.getAllByRole('textbox');
    await user.click(inputs[0]!);
    await user.keyboard('012345');
    await expect(inputs[5]).toHaveFocus();
    await expect(inputs.map((input) => (input as HTMLInputElement).value).join('')).toBe('012345');
    await user.keyboard('[Home]');
    await user.paste('98 7654');
    await expect(inputs.map((input) => (input as HTMLInputElement).value).join('')).toBe('987654');
    await user.keyboard('[Backspace]');
    await expect(inputs[5]).toHaveValue('');
  },
};

export const Alphanumeric: Story = { args: { length: 4, validationType: 'alphanumeric' } };
export const Masked: Story = { args: { mask: true } };
export const Disabled: Story = { args: { disabled: true } };
export const ReadOnly: Story = { args: { readOnly: true } };
export const Invalid: Story = { args: { invalid: true } };

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-4">
      {(['xsm', 'sm', 'md', 'lg', 'xlg'] as const).map((size) => (
        <Field.Root key={size}>
          <Field.Label>{size} code</Field.Label>
          <OtpInput.Root size={size} defaultValue="123" />
        </Field.Root>
      ))}
    </div>
  ),
};

export const Grouped: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Recovery code</Field.Label>
      <OtpInput.Root>
        <OtpInput.Input />
        <OtpInput.Input />
        <OtpInput.Input />
        <span aria-hidden="true">–</span>
        <OtpInput.Input />
        <OtpInput.Input />
        <OtpInput.Input />
      </OtpInput.Root>
    </Field.Root>
  ),
};
