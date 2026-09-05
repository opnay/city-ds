import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Kbd as RootKbd } from '../../src';
import { Kbd } from '../../src/components/kbd';

describe('Kbd', () => {
  it('exports the same component from the package root', () => {
    expect(RootKbd).toBe(Kbd);
  });

  it('uses a native kbd element with an accessible shortcut name', () => {
    render(<Kbd aria-label="명령 팔레트 단축키">⌘ K</Kbd>);

    const shortcut = screen.getByLabelText('명령 팔레트 단축키');

    expect(shortcut.tagName).toBe('KBD');
    expect(shortcut).toHaveAccessibleName('명령 팔레트 단축키');
    expect(shortcut).toHaveTextContent('⌘ K');
    expect(shortcut).not.toHaveAttribute('role');
    expect(shortcut).toHaveAttribute('data-city-kbd', '');
    expect(shortcut).toHaveClass('border-city-border', 'bg-city-muted', 'font-mono');
  });

  it.each(['sm', 'md', 'lg'] as const)('exposes %s size to render composition state', (size) => {
    render(
      <Kbd
        aria-label={`${size} 단축키`}
        className={(state) => `kbd-size-${state.size}`}
        size={size}
      >
        ⌘ K
      </Kbd>,
    );

    const shortcut = screen.getByLabelText(`${size} 단축키`);

    expect(shortcut).toHaveAttribute('data-city-size', size);
    expect(shortcut).toHaveClass(`kbd-size-${size}`);
  });

  it('preserves the Base UI render and ref composition contract', () => {
    const ref = React.createRef<HTMLElement>();

    render(
      <Kbd ref={ref} render={<span data-composed="true" />}>
        ⇧ P
      </Kbd>,
    );

    const shortcut = screen.getByText('⇧ P');

    expect(shortcut.tagName).toBe('SPAN');
    expect(ref.current).toBe(shortcut);
    expect(shortcut).toHaveAttribute('data-composed', 'true');
    expect(shortcut).toHaveAttribute('data-city-kbd', '');
  });
});
