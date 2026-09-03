import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toolbar } from '../../src/components/toolbar';

describe('Toolbar', () => {
  it('supports plain, band, and outline surface appearances', () => {
    render(
      <>
        <Toolbar.Root appearance="plain" aria-label="Plain tools" />
        <Toolbar.Root appearance="band" aria-label="Band tools" />
        <Toolbar.Root aria-label="Outline tools" />
      </>,
    );

    const plain = screen.getByRole('toolbar', { name: 'Plain tools' });
    const band = screen.getByRole('toolbar', { name: 'Band tools' });
    const outline = screen.getByRole('toolbar', { name: 'Outline tools' });

    expect(plain).toHaveAttribute('data-appearance', 'plain');
    expect(plain).toHaveClass('bg-transparent');
    expect(plain).not.toHaveClass('border');
    expect(band).toHaveAttribute('data-appearance', 'band');
    expect(band).toHaveClass('border-b', 'bg-city-surface');
    expect(outline).toHaveAttribute('data-appearance', 'outline');
    expect(outline).toHaveClass('rounded-city-md', 'border');
  });

  it('keeps toolbar semantics and roving focus for arrow-key navigation', async () => {
    const user = userEvent.setup();

    render(
      <Toolbar.Root aria-label="Editor tools">
        <Toolbar.Button variant="ghost">Bold</Toolbar.Button>
        <Toolbar.Button>Italic</Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Button>Underline</Toolbar.Button>
      </Toolbar.Root>,
    );

    expect(screen.getByRole('toolbar', { name: 'Editor tools' })).toHaveAttribute(
      'data-orientation',
      'horizontal',
    );
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveClass(
      'hover:bg-city-accent',
      'active:bg-city-accent-active',
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Underline' })).toHaveFocus();
  });

  it('supports vertical navigation, disabled items, links, groups, and actions', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <Toolbar.Root aria-label="View tools" orientation="vertical">
        <Toolbar.Group>
          <Toolbar.Button onClick={onSave}>Save</Toolbar.Button>
          <Toolbar.Button disabled>Export</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Link href="#help">Help</Toolbar.Link>
      </Toolbar.Root>,
    );

    expect(screen.getByRole('toolbar', { name: 'View tools' })).toHaveAttribute(
      'data-orientation',
      'vertical',
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onSave).toHaveBeenCalledTimes(1);
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Export' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('link', { name: 'Help' })).toHaveFocus();
  });

  it('honors the render composition contract', () => {
    render(
      <Toolbar.Root aria-label="Composed tools">
        <Toolbar.Button render={<button data-composed="true" type="button" />}>
          Compose
        </Toolbar.Button>
      </Toolbar.Root>,
    );

    expect(screen.getByRole('button', { name: 'Compose' })).toHaveAttribute(
      'data-composed',
      'true',
    );
  });

  it('inherits the root size while allowing an item override', () => {
    render(
      <Toolbar.Root aria-label="Sized tools" size="sm">
        <Toolbar.Button>Inherited</Toolbar.Button>
        <Toolbar.Link href="#large" size="lg">
          Large
        </Toolbar.Link>
      </Toolbar.Root>,
    );

    expect(screen.getByRole('button', { name: 'Inherited' })).toHaveClass(
      'h-(--city-control-sm)',
      'text-xs',
    );
    expect(screen.getByRole('link', { name: 'Large' })).toHaveClass(
      'h-(--city-control-lg)',
      'text-sm',
    );
  });

  it('keeps vertical items and groups at a consistent width', () => {
    render(
      <Toolbar.Root aria-label="Vertical tools" orientation="vertical">
        <Toolbar.Group data-testid="group">
          <Toolbar.Button>Action</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Link href="#help">Help</Toolbar.Link>
      </Toolbar.Root>,
    );

    expect(screen.getByRole('toolbar', { name: 'Vertical tools' })).toHaveClass(
      'data-[orientation=vertical]:items-stretch',
    );
    expect(screen.getByTestId('group')).toHaveClass('data-[orientation=vertical]:w-full');
    expect(screen.getByRole('button', { name: 'Action' })).toHaveClass(
      'data-[orientation=vertical]:w-full',
    );
    expect(screen.getByRole('link', { name: 'Help' })).toHaveClass(
      'data-[orientation=vertical]:w-full',
    );
  });

  it('coordinates pressed tools through its toggle group', async () => {
    const user = userEvent.setup();

    render(
      <Toolbar.Root aria-label="Formatting tools" size="sm">
        <Toolbar.ToggleGroup defaultValue={['bold']} multiple>
          <Toolbar.Toggle value="bold">Bold</Toolbar.Toggle>
          <Toolbar.Toggle value="italic">Italic</Toolbar.Toggle>
        </Toolbar.ToggleGroup>
      </Toolbar.Root>,
    );

    const bold = screen.getByRole('button', { name: 'Bold' });
    const italic = screen.getByRole('button', { name: 'Italic' });

    expect(bold).toHaveAttribute('aria-pressed', 'true');
    expect(bold).toHaveClass('h-(--city-control-sm)');
    await user.click(italic);
    expect(bold).toHaveAttribute('aria-pressed', 'true');
    expect(italic).toHaveAttribute('aria-pressed', 'true');
  });
});
