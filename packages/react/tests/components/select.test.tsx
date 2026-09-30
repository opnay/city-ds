import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Select } from '../../src/components/select';

describe('Select', () => {
  it('selects an option and passes Base UI event details', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Select.Root defaultValue="draft" onValueChange={onValueChange}>
        <Select.Trigger
          aria-label="Status"
          className={(state) => (state.open ? 'is-open' : 'is-closed')}
        >
          <Select.Value placeholder="Choose status" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.List>
                <Select.Item value="draft">
                  <Select.ItemIndicator />
                  <Select.ItemText>Draft</Select.ItemText>
                </Select.Item>
                <Select.Item value="published">
                  <Select.ItemIndicator />
                  <Select.ItemText>Published</Select.ItemText>
                </Select.Item>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>,
    );

    const trigger = screen.getByRole('combobox', { name: 'Status' });
    const icon = trigger.querySelector('[data-city-select-icon]');
    expect(trigger).toHaveClass('is-closed');
    expect(icon).toHaveClass('border-l', 'w-(--city-control-md)');
    await user.click(trigger.firstElementChild as HTMLElement);
    const published = await screen.findByRole('option', { name: 'Published' });
    expect(trigger).toHaveClass('is-open');
    expect(icon).toHaveAttribute('data-popup-open');
    expect(published).toHaveClass('data-[highlighted]:bg-city-accent-hover');
    expect(screen.getByRole('listbox').parentElement).toHaveClass(
      'bg-city-background',
      'min-w-(--anchor-width)',
      'data-[side=bottom]:-mt-px',
      'data-[side=bottom]:rounded-t-none',
    );
    await user.click(published);

    expect(onValueChange).toHaveBeenCalledWith(
      'published',
      expect.objectContaining({ reason: 'item-press' }),
    );
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });
});
