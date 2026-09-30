import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ToggleGroup } from '../../src/components/toggle-group';

describe('ToggleGroup', () => {
  it('changes a releasable ToggleGroup tool value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup aria-label="Pinned column" defaultValue={['left']} onValueChange={onValueChange}>
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole('button', { name: 'Right' }));

    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Right' })).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(
      ['right'],
      expect.objectContaining({ reason: 'none' }),
    );
  });

  it('changes ToggleGroup multiple values and leaves disabled groups unchanged', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <>
        <ToggleGroup
          aria-label="Text style"
          defaultValue={['bold']}
          multiple
          onValueChange={onValueChange}
        >
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        </ToggleGroup>
        <ToggleGroup aria-label="Locked formatting" defaultValue={['code']} disabled>
          <ToggleGroup.Item value="code">Code</ToggleGroup.Item>
          <ToggleGroup.Item value="quote">Quote</ToggleGroup.Item>
        </ToggleGroup>
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Italic' }));
    await user.click(screen.getByRole('button', { name: 'Quote' }));

    const disabledGroup = screen.getByRole('group', { name: 'Locked formatting' });
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Code' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Quote' })).toHaveAttribute('aria-pressed', 'false');
    expect(disabledGroup).not.toHaveClass('data-[disabled]:opacity-50');
    expect(screen.getByRole('button', { name: 'Code' })).toHaveClass('data-[disabled]:opacity-50');
    expect(onValueChange).toHaveBeenLastCalledWith(
      ['bold', 'italic'],
      expect.objectContaining({ reason: 'none' }),
    );
  });

  it('inherits ToggleGroup styles, preserves item overrides, and forwards the root ref', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <ToggleGroup
        ref={ref}
        aria-label="Formatting"
        defaultValue={['bold']}
        size="lg"
        variant="primary"
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item size="sm" value="italic" variant="ghost">
          Italic
        </ToggleGroup.Item>
      </ToggleGroup>,
    );

    const group = screen.getByRole('group', { name: 'Formatting' });
    const inheritedItem = screen.getByRole('button', { name: 'Bold' });
    const overriddenItem = screen.getByRole('button', { name: 'Italic' });

    expect(ref.current).toBe(group);
    expect(inheritedItem).toHaveClass('h-(--city-control-lg)', 'bg-city-primary');
    expect(overriddenItem).toHaveClass(
      'h-(--city-control-sm)',
      'hover:bg-city-accent',
      'data-[pressed]:underline',
      'data-[pressed]:underline-offset-4',
    );
    expect(overriddenItem).not.toHaveClass('opacity-[0.84]');
    expect(overriddenItem).not.toHaveClass('data-[pressed]:bg-city-inverse');
  });

  it('moves ToggleGroup focus with arrow keys', async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup aria-label="Pinned panel" defaultValue={['top']}>
        <ToggleGroup.Item value="top">Top</ToggleGroup.Item>
        <ToggleGroup.Item value="bottom">Bottom</ToggleGroup.Item>
        <ToggleGroup.Item value="side">Side</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const top = screen.getByRole('button', { name: 'Top' });
    const bottom = screen.getByRole('button', { name: 'Bottom' });

    top.focus();
    await user.keyboard('[ArrowRight]');

    expect(bottom).toHaveFocus();
  });
});
