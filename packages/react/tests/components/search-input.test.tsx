import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SearchInput } from '../../src/components/search-input';

function SearchControls({ name }: { name?: string }) {
  return (
    <SearchInput.Group>
      <SearchInput.Input aria-label="Search" name={name} />
      <SearchInput.Clear />
      <SearchInput.Submit />
    </SearchInput.Group>
  );
}

describe('SearchInput', () => {
  it('leaves form ownership and FormData submission to the consumer form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      return new FormData(event.currentTarget).get('query');
    });

    const { container } = render(
      <form onSubmit={onSubmit}>
        <SearchInput.Root data-testid="search-root">
          <SearchControls name="query" />
        </SearchInput.Root>
      </form>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search' });

    expect(container.querySelectorAll('form')).toHaveLength(1);
    expect(screen.getByTestId('search-root').tagName).toBe('DIV');

    await user.type(input, 'city{Enter}');

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveReturnedWith('city');
  });

  it('returns focus to the input in the same SearchInput root', async () => {
    const user = userEvent.setup();

    render(
      <form>
        <SearchInput.Root data-testid="first-search" defaultValue="first">
          <SearchControls />
        </SearchInput.Root>
        <SearchInput.Root data-testid="second-search" defaultValue="second">
          <SearchControls />
        </SearchInput.Root>
      </form>,
    );

    const firstSearch = within(screen.getByTestId('first-search'));
    const secondSearch = within(screen.getByTestId('second-search'));
    const firstInput = firstSearch.getByRole('searchbox');
    const secondInput = secondSearch.getByRole('searchbox');

    await user.click(secondSearch.getByRole('button', { name: 'Clear search' }));

    expect(firstInput).toHaveValue('first');
    expect(secondInput).toHaveValue('');
    expect(secondInput).toHaveFocus();
  });

  it('does not clear when the consumer cancels Clear onClick', async () => {
    const user = userEvent.setup();
    const onClearClick = vi.fn((event: React.MouseEvent<HTMLElement>) => event.preventDefault());
    const onValueChange = vi.fn();

    render(
      <SearchInput.Root defaultValue="city" onValueChange={onValueChange}>
        <SearchInput.Group>
          <SearchInput.Input aria-label="Search" />
          <SearchInput.Clear onClick={onClearClick} />
        </SearchInput.Group>
      </SearchInput.Root>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search' });
    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(onClearClick).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('city');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('supports consumer render props, refs, and value callbacks', async () => {
    const user = userEvent.setup();
    const rootRef = React.createRef<HTMLDivElement>();
    const inputRef = React.createRef<HTMLElement>();
    const onRootClick = vi.fn();
    const onValueChange = vi.fn();
    const onInputValueChange = vi.fn();

    render(
      <SearchInput.Root
        onClick={onRootClick}
        onValueChange={onValueChange}
        ref={rootRef}
        render={<div data-testid="rendered-root" />}
      >
        <SearchInput.Group>
          <SearchInput.Input
            aria-label="Search"
            onValueChange={onInputValueChange}
            ref={inputRef}
          />
        </SearchInput.Group>
      </SearchInput.Root>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search' });

    expect(rootRef.current).toBe(screen.getByTestId('rendered-root'));
    expect(inputRef.current).toBe(input);

    await user.type(input, 'city');

    expect(onRootClick).toHaveBeenCalled();
    expect(onValueChange).toHaveBeenLastCalledWith('city');
    expect(onInputValueChange).toHaveBeenLastCalledWith('city', expect.anything());
  });

  it('preserves callback ref cleanup', () => {
    const cleanup = vi.fn();
    const inputRef: React.RefCallback<HTMLElement> = () => cleanup;
    const { unmount } = render(
      <SearchInput.Root>
        <SearchInput.Group>
          <SearchInput.Input aria-label="Search" ref={inputRef} />
        </SearchInput.Group>
      </SearchInput.Root>,
    );

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('disables every inline control without emitting value changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SearchInput.Root defaultValue="archived" disabled onValueChange={onValueChange}>
        <SearchControls />
      </SearchInput.Root>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search' });
    const clear = screen.getByRole('button', { name: 'Clear search' });
    const submit = screen.getByRole('button', { name: 'Search' });

    expect(input).toBeDisabled();
    expect(clear).toBeDisabled();
    expect(submit).toBeDisabled();

    await user.type(input, ' next');
    await user.click(clear);

    expect(input).toHaveValue('archived');
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
