'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { Search, X } from 'lucide-react';

import { Button, type ButtonProps } from '../button';
import { Input, InputGroup, type InputGroupProps, type InputProps } from '../input';
import { cn } from '../../lib/cn';
import { outlineFrameSegmentWidthClasses } from '../../lib/outline-frame';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

type SearchInputState = {
  disabled: boolean;
  empty: boolean;
  loading: boolean;
};

type SearchInputRootState = Record<never, never>;

type SearchInputContextValue = {
  disabled: boolean;
  inputRef: React.RefObject<HTMLElement | null>;
  invalid: boolean;
  loading: boolean;
  setValue: (value: string) => void;
  size: ControlSize;
  value: string;
};

const SearchInputContext = React.createContext<SearchInputContextValue | null>(null);

function useSearchInputContext(component: string) {
  const context = React.useContext(SearchInputContext);

  if (!context) {
    throw new Error(`${component} must be used within SearchInput.Root`);
  }

  return context;
}

export interface SearchInputRootProps extends Omit<
  useRender.ComponentProps<'div', SearchInputRootState>,
  'className'
> {
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  onValueChange?: (value: string) => void;
  size?: ControlSize;
  value?: string;
}

export const SearchInputRoot = React.forwardRef<HTMLDivElement, SearchInputRootProps>(
  function SearchInputRoot(
    {
      children,
      className,
      defaultValue = '',
      disabled = false,
      invalid = false,
      loading = false,
      onValueChange,
      render,
      size = 'md',
      value: valueProp,
      ...props
    },
    ref,
  ) {
    const isControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const inputRef = React.useRef<HTMLElement | null>(null);
    const value = isControlled ? valueProp : uncontrolledValue;
    const setValue = React.useCallback(
      (nextValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }
        onValueChange?.(nextValue);
      },
      [isControlled, onValueChange],
    );

    const context = React.useMemo<SearchInputContextValue>(
      () => ({ disabled, inputRef, invalid, loading, setValue, size, value }),
      [disabled, invalid, loading, setValue, size, value],
    );

    const state: SearchInputRootState = {};

    return (
      <SearchInputContext.Provider value={context}>
        {useRender({
          defaultTagName: 'div',
          ref,
          render,
          state,
          props: {
            ...props,
            children,
            className: cn('grid gap-1.5', className),
          },
        })}
      </SearchInputContext.Provider>
    );
  },
);

SearchInputRoot.displayName = 'SearchInput.Root';

export type SearchInputGroupProps = Omit<InputGroupProps, 'size'>;

export const SearchInputGroup = React.forwardRef<HTMLDivElement, SearchInputGroupProps>(
  function SearchInputGroup({ className, ...props }, ref) {
    const context = useSearchInputContext('SearchInput.Group');

    return (
      <InputGroup.Root
        {...props}
        ref={ref}
        className={(state) =>
          cn(
            'data-[invalid]:border-city-destructive data-[invalid]:focus-within:ring-city-destructive data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 [&>button:disabled]:opacity-100 [&>input:disabled]:opacity-100',
            resolveClassName(className, state),
          )
        }
        data-disabled={context.disabled ? '' : undefined}
        data-invalid={context.invalid ? '' : undefined}
        size={context.size}
      />
    );
  },
);

SearchInputGroup.displayName = 'SearchInput.Group';

export interface SearchInputInputProps extends Omit<
  InputProps,
  'onValueChange' | 'size' | 'type' | 'value'
> {
  onValueChange?: InputProps['onValueChange'];
  size?: ControlSize;
}

type SearchInputInputRefCallback = (node: HTMLElement | null) => void | (() => void);

export const SearchInputInput = React.forwardRef<HTMLElement, SearchInputInputProps>(
  function SearchInputInput({ className, onKeyDown, onValueChange, size, ...props }, forwardedRef) {
    const context = useSearchInputContext('SearchInput.Input');
    const setRefs = React.useCallback(
      (node: HTMLElement | null) => {
        context.inputRef.current = node;

        if (typeof forwardedRef === 'function') {
          const cleanup = (forwardedRef as SearchInputInputRefCallback)(node);

          if (typeof cleanup === 'function') {
            return () => {
              if (context.inputRef.current === node) {
                context.inputRef.current = null;
              }
              cleanup();
            };
          }
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [context.inputRef, forwardedRef],
    );

    return (
      <Input
        {...props}
        ref={setRefs}
        aria-invalid={context.invalid || props['aria-invalid'] || undefined}
        className={(state) =>
          cn(
            'appearance-none [&::-webkit-search-cancel-button]:appearance-none',
            resolveClassName(className, state),
          )
        }
        disabled={context.disabled || props.disabled}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === 'Escape') {
            context.setValue('');
          }
        }}
        onValueChange={(nextValue, details) => {
          context.setValue(nextValue);
          onValueChange?.(nextValue, details);
        }}
        size={size ?? context.size}
        type="search"
        value={context.value}
      />
    );
  },
);

SearchInputInput.displayName = 'SearchInput.Input';

const auxiliaryButtonSizeClasses: Record<ControlSize, string> = {
  xsm: 'size-5 p-0',
  sm: 'size-6 p-0',
  md: 'size-7 p-0',
  lg: 'size-8 p-0',
  xlg: 'size-9 p-0',
};

const iconSizes: Record<ControlSize, number> = {
  xsm: 12,
  sm: 14,
  md: 14,
  lg: 16,
  xlg: 16,
};

export interface SearchInputClearProps extends Omit<ButtonProps, 'children' | 'size' | 'variant'> {
  children?: React.ReactNode;
  hideWhenEmpty?: boolean;
  size?: ControlSize;
}

export const SearchInputClear = React.forwardRef<HTMLElement, SearchInputClearProps>(
  function SearchInputClear(
    { children, className, hideWhenEmpty = true, onClick, size, ...props },
    ref,
  ) {
    const context = useSearchInputContext('SearchInput.Clear');
    const isEmpty = context.value.length === 0;
    const resolvedSize = size ?? context.size;

    if (hideWhenEmpty && isEmpty) {
      return null;
    }

    return (
      <Button
        {...props}
        ref={ref}
        aria-label={
          props['aria-label'] ?? (typeof children === 'string' ? children : 'Clear search')
        }
        className={(state) =>
          cn(
            'text-city-muted-foreground hover:text-city-foreground rounded-city-xs shrink-0',
            children == null && auxiliaryButtonSizeClasses[resolvedSize],
            resolveClassName(className, state),
          )
        }
        disabled={context.disabled || props.disabled || isEmpty}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;

          context.setValue('');
          context.inputRef.current?.focus();
        }}
        size={resolvedSize}
        type="button"
        variant="ghost"
      >
        {children ?? <X aria-hidden="true" size={iconSizes[resolvedSize]} strokeWidth={1.8} />}
      </Button>
    );
  },
);

SearchInputClear.displayName = 'SearchInput.Clear';

export interface SearchInputSubmitProps extends Omit<ButtonProps, 'size' | 'variant'> {
  size?: ControlSize;
}

export const SearchInputSubmit = React.forwardRef<HTMLElement, SearchInputSubmitProps>(
  function SearchInputSubmit({ children, className, size, ...props }, ref) {
    const context = useSearchInputContext('SearchInput.Submit');
    const resolvedSize = size ?? context.size;

    return (
      <Button
        {...props}
        ref={ref}
        aria-label={props['aria-label'] ?? (typeof children === 'string' ? children : 'Search')}
        className={(state) =>
          cn(
            'border-city-border text-city-muted-foreground hover:bg-city-accent hover:text-city-accent-foreground active:bg-city-accent-active focus-visible:ring-city-ring z-0 h-full shrink-0 self-stretch rounded-none border-l focus-visible:z-10 focus-visible:ring-offset-0',
            children == null && cn(outlineFrameSegmentWidthClasses[resolvedSize], 'px-0'),
            resolveClassName(className, state),
          )
        }
        disabled={context.disabled || props.disabled}
        size={resolvedSize}
        type="submit"
        variant="ghost"
      >
        {children ?? <Search aria-hidden="true" size={iconSizes[resolvedSize]} strokeWidth={1.8} />}
      </Button>
    );
  },
);

SearchInputSubmit.displayName = 'SearchInput.Submit';

export interface SearchInputLoadingProps extends Omit<
  useRender.ComponentProps<'span', SearchInputState>,
  'className'
> {
  className?: StateClassName<SearchInputState>;
}

export const SearchInputLoading = React.forwardRef<HTMLSpanElement, SearchInputLoadingProps>(
  function SearchInputLoading({ className, render, ...props }, ref) {
    const context = useSearchInputContext('SearchInput.Loading');
    const state: SearchInputState = {
      disabled: context.disabled,
      empty: context.value.length === 0,
      loading: context.loading,
    };

    const element = useRender({
      defaultTagName: 'span',
      ref,
      render,
      state,
      props: {
        ...props,
        'aria-live': props['aria-live'] ?? 'polite',
        className: cn('text-city-muted-foreground text-sm', resolveClassName(className, state)),
      },
    });

    return context.loading ? element : null;
  },
);

SearchInputLoading.displayName = 'SearchInput.Loading';

export const SearchInput = {
  Root: SearchInputRoot,
  Group: SearchInputGroup,
  Input: SearchInputInput,
  Clear: SearchInputClear,
  Submit: SearchInputSubmit,
  Loading: SearchInputLoading,
};
