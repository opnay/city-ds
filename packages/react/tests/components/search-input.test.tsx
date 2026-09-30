import * as React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Field } from '../../src/components/field';
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
  it('leaves form ownership and keyboard or button submission to the consumer form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    const { container } = render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(new FormData(event.currentTarget).get('query'), event);
        }}
      >
        <Field.Root>
          <Field.Label>Search projects</Field.Label>
          <SearchInput.Root data-testid="search-root">
            <SearchInput.Group data-testid="search-group">
              <SearchInput.Input name="query" />
              <SearchInput.Clear />
              <SearchInput.Submit />
            </SearchInput.Group>
          </SearchInput.Root>
        </Field.Root>
      </form>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search projects' });
    const searchButton = screen.getByRole('button', { name: 'Search' });

    expect(container.querySelectorAll('form')).toHaveLength(1);
    expect(screen.getByTestId('search-root').tagName).toBe('DIV');
    expect(screen.getByTestId('search-group')).toContainElement(input);
    expect(screen.getByTestId('search-group')).toHaveClass('h-(--city-control-md)');
    expect(searchButton).toHaveClass('hover:bg-city-accent', 'active:bg-city-accent-active');
    expect(searchButton).toHaveClass('h-full', 'w-(--city-control-md)');
    expect(input).toHaveAttribute('type', 'search');
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    await user.type(input, 'metro');
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('');

    await user.type(input, 'roads{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenLastCalledWith('roads', expect.anything());

    await user.clear(input);
    await user.type(input, 'bridges');
    await user.click(searchButton);
    expect(onSubmit).toHaveBeenLastCalledWith('bridges', expect.anything());
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

  it('reserves Clear space while hiding an empty value from sight and the tab order', async () => {
    const user = userEvent.setup();

    render(
      <SearchInput.Root defaultValue="city">
        <SearchInput.Group>
          <SearchInput.Input aria-label="Search" />
          <SearchInput.Clear data-testid="clear" />
        </SearchInput.Group>
      </SearchInput.Root>,
    );

    const clear = screen.getByTestId('clear');
    const input = screen.getByRole('searchbox', { name: 'Search' });

    expect(clear).toHaveClass('size-7');
    await user.click(clear);

    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    expect(screen.getByTestId('clear')).toBe(clear);
    expect(clear).toHaveClass('size-7', 'invisible');
    expect(clear).toHaveAttribute('aria-hidden', 'true');
    expect(clear).toHaveAttribute('tabindex', '-1');
    expect(clear).toBeDisabled();

    await user.type(input, 'city');

    expect(screen.getByTestId('clear')).toBe(clear);
    expect(clear).not.toHaveClass('invisible');
    expect(clear).not.toHaveAttribute('aria-hidden');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBe(clear);
  });

  it('keeps default and custom Clear widths for every size while empty', () => {
    const sizes = [
      ['xsm', 'size-5'],
      ['sm', 'size-6'],
      ['md', 'size-7'],
      ['lg', 'size-8'],
      ['xlg', 'size-9'],
    ] as const;

    render(
      <>
        {sizes.map(([size]) => (
          <SearchInput.Root key={size} size={size}>
            <SearchInput.Group>
              <SearchInput.Input aria-label={`Search ${size}`} />
              <SearchInput.Clear data-testid={`clear-${size}`} />
            </SearchInput.Group>
          </SearchInput.Root>
        ))}
        <SearchInput.Root>
          <SearchInput.Group>
            <SearchInput.Input aria-label="Custom search" />
            <SearchInput.Clear className="w-32" data-testid="custom-clear">
              Clear query
            </SearchInput.Clear>
          </SearchInput.Group>
        </SearchInput.Root>
      </>,
    );

    for (const [size, sizeClass] of sizes) {
      const clear = screen.getByTestId(`clear-${size}`);
      expect(clear).toHaveClass(sizeClass, 'invisible');
      expect(clear).toHaveAttribute('aria-hidden', 'true');
      expect(clear).toHaveAttribute('tabindex', '-1');
      expect(clear).toBeDisabled();
    }

    const customClear = screen.getByTestId('custom-clear');
    expect(customClear).toHaveClass('w-32', 'invisible');
    expect(customClear).toHaveAttribute('aria-hidden', 'true');
    expect(customClear).toHaveAttribute('tabindex', '-1');
    expect(customClear).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear query' })).not.toBeInTheDocument();
  });

  it('keeps Clear visible and disabled for an empty value when hideWhenEmpty is false', () => {
    render(
      <SearchInput.Root>
        <SearchInput.Group>
          <SearchInput.Input aria-label="Search" />
          <SearchInput.Clear hideWhenEmpty={false} />
        </SearchInput.Group>
      </SearchInput.Root>,
    );

    const clear = screen.getByRole('button', { name: 'Clear search' });
    expect(clear).not.toHaveClass('invisible');
    expect(clear).not.toHaveAttribute('aria-hidden');
    expect(clear).toBeDisabled();
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
        <SearchInput.Group data-testid="disabled-search-group">
          <SearchInput.Input aria-label="Disabled search" disabled={false} />
          <SearchInput.Clear disabled={false} />
          <SearchInput.Submit disabled={false} />
        </SearchInput.Group>
      </SearchInput.Root>,
    );

    const input = screen.getByRole('searchbox', { name: 'Disabled search' });
    const clear = screen.getByRole('button', { name: 'Clear search' });
    const submit = screen.getByRole('button', { name: 'Search' });

    const group = screen.getByTestId('disabled-search-group');
    expect(group).toHaveAttribute('data-disabled');
    expect(group).toHaveClass('data-[disabled]:opacity-50');
    expect(input).toBeDisabled();
    expect(clear).toBeDisabled();
    expect(submit).toBeDisabled();

    await user.type(input, ' next');
    await user.click(clear);

    expect(input).toHaveValue('archived');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('supports SearchInput controlled values and loading status', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function ControlledSearch() {
      const [value, setValue] = React.useState('city');

      return (
        <Field.Root>
          <Field.Label>Search packages</Field.Label>
          <SearchInput.Root
            loading
            onValueChange={(nextValue) => {
              setValue(nextValue);
              onValueChange(nextValue);
            }}
            value={value}
          >
            <SearchInput.Group>
              <SearchInput.Input />
              <SearchInput.Clear />
              <SearchInput.Submit />
            </SearchInput.Group>
            <SearchInput.Loading>Searching…</SearchInput.Loading>
          </SearchInput.Root>
        </Field.Root>
      );
    }

    render(<ControlledSearch />);

    const input = screen.getByRole('searchbox', { name: 'Search packages' });
    expect(input).toHaveValue('city');
    expect(screen.getByText('Searching…')).toBeVisible();

    await user.type(input, ' ds');
    expect(input).toHaveValue('city ds');
    expect(onValueChange).toHaveBeenLastCalledWith('city ds');

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('propagates invalid state to the input and group while displaying Field errors', () => {
    render(
      <Field.Root>
        <Field.Label>Invalid search</Field.Label>
        <SearchInput.Root defaultValue="x" invalid>
          <SearchInput.Group data-testid="invalid-search-group">
            <SearchInput.Input />
            <SearchInput.Clear />
            <SearchInput.Submit />
          </SearchInput.Group>
        </SearchInput.Root>
        <Field.Error match>Enter at least 2 characters.</Field.Error>
      </Field.Root>,
    );

    const invalidGroup = screen.getByTestId('invalid-search-group');
    expect(invalidGroup).toHaveAttribute('data-invalid');
    expect(invalidGroup).toHaveClass('data-[invalid]:border-city-destructive');
    expect(within(invalidGroup).getByRole('searchbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter at least 2 characters.')).toBeVisible();
  });
});
