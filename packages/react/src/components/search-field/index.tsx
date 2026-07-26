'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { Search, X } from 'lucide-react';

import { Button, type ButtonProps } from '../button';
import {
  Field,
  type FieldDescriptionProps,
  type FieldErrorProps,
  type FieldLabelProps,
} from '../field';
import { Input, InputGroup, type InputGroupProps, type InputProps } from '../input';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

type SearchFieldState = {
  disabled: boolean;
  empty: boolean;
  loading: boolean;
};

type SearchFieldContextValue = {
  disabled: boolean;
  invalid: boolean;
  loading: boolean;
  setValue: (value: string) => void;
  size: ControlSize;
  value: string;
};

const SearchFieldContext = React.createContext<SearchFieldContextValue | null>(null);

function useSearchFieldContext(component: string) {
  const context = React.useContext(SearchFieldContext);

  if (!context) {
    throw new Error(`${component} must be used within SearchField.Root`);
  }

  return context;
}

export interface SearchFieldRootProps extends Omit<
  React.ComponentPropsWithoutRef<'form'>,
  'onSubmit'
> {
  defaultValue?: string;
  disabled?: boolean;
  invalid?: boolean;
  loading?: boolean;
  onSubmit?: (value: string, event?: React.FormEvent<HTMLFormElement>) => void;
  onValueChange?: (value: string) => void;
  size?: ControlSize;
  value?: string;
}

export const SearchFieldRoot = React.forwardRef<HTMLFormElement, SearchFieldRootProps>(
  function SearchFieldRoot(
    {
      children,
      className,
      defaultValue = '',
      disabled = false,
      invalid = false,
      loading = false,
      onSubmit,
      onValueChange,
      size = 'md',
      value: valueProp,
      ...props
    },
    ref,
  ) {
    const isControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
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

    const context = React.useMemo<SearchFieldContextValue>(
      () => ({ disabled, invalid, loading, setValue, size, value }),
      [disabled, invalid, loading, setValue, size, value],
    );

    return (
      <SearchFieldContext.Provider value={context}>
        <Field.Root disabled={disabled} invalid={invalid}>
          <form
            {...props}
            ref={ref}
            className={cn('grid gap-1.5', className)}
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit?.(value, event);
            }}
          >
            {children}
          </form>
        </Field.Root>
      </SearchFieldContext.Provider>
    );
  },
);

SearchFieldRoot.displayName = 'SearchField.Root';

export const SearchFieldLabel = Field.Label;
export type SearchFieldLabelProps = FieldLabelProps;

export const SearchFieldDescription = Field.Description;
export type SearchFieldDescriptionProps = FieldDescriptionProps;

export const SearchFieldError = Field.Error;
export type SearchFieldErrorProps = FieldErrorProps;

export type SearchFieldGroupProps = Omit<InputGroupProps, 'size'>;

export const SearchFieldGroup = React.forwardRef<HTMLDivElement, SearchFieldGroupProps>(
  function SearchFieldGroup({ className, ...props }, ref) {
    const context = useSearchFieldContext('SearchField.Group');

    return (
      <InputGroup.Root
        {...props}
        ref={ref}
        className={(state) =>
          cn(
            'data-[invalid]:border-city-destructive data-[invalid]:focus-within:ring-city-destructive/30 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 [&>button:disabled]:opacity-100 [&>input:disabled]:opacity-100',
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

SearchFieldGroup.displayName = 'SearchField.Group';

export interface SearchFieldInputProps extends Omit<
  InputProps,
  'onValueChange' | 'size' | 'type' | 'value'
> {
  onValueChange?: InputProps['onValueChange'];
  size?: ControlSize;
}

export const SearchFieldInput = React.forwardRef<HTMLElement, SearchFieldInputProps>(
  function SearchFieldInput({ className, onKeyDown, onValueChange, size, ...props }, forwardedRef) {
    const context = useSearchFieldContext('SearchField.Input');

    return (
      <Input
        {...props}
        ref={forwardedRef}
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

SearchFieldInput.displayName = 'SearchField.Input';

const auxiliaryButtonSizeClasses: Record<ControlSize, string> = {
  sm: 'size-7 p-0',
  md: 'size-8 p-0',
  lg: 'size-9 p-0',
};

const actionButtonSizeClasses: Record<ControlSize, string> = {
  sm: 'w-8 px-0',
  md: 'w-9 px-0',
  lg: 'w-10 px-0',
};

const iconSizes: Record<ControlSize, number> = {
  sm: 14,
  md: 16,
  lg: 16,
};

export interface SearchFieldClearProps extends Omit<ButtonProps, 'children' | 'size' | 'variant'> {
  children?: React.ReactNode;
  hideWhenEmpty?: boolean;
  size?: ControlSize;
}

export const SearchFieldClear = React.forwardRef<HTMLElement, SearchFieldClearProps>(
  function SearchFieldClear(
    { children, className, hideWhenEmpty = true, onClick, size, ...props },
    ref,
  ) {
    const context = useSearchFieldContext('SearchField.Clear');
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
          context.setValue('');
          event.currentTarget.form
            ?.querySelector<HTMLInputElement>('input[type="search"]')
            ?.focus();
          onClick?.(event);
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

SearchFieldClear.displayName = 'SearchField.Clear';

export interface SearchFieldSubmitProps extends Omit<ButtonProps, 'size' | 'variant'> {
  size?: ControlSize;
}

export const SearchFieldSubmit = React.forwardRef<HTMLElement, SearchFieldSubmitProps>(
  function SearchFieldSubmit({ children, className, size, ...props }, ref) {
    const context = useSearchFieldContext('SearchField.Submit');
    const resolvedSize = size ?? context.size;

    return (
      <Button
        {...props}
        ref={ref}
        aria-label={props['aria-label'] ?? (typeof children === 'string' ? children : 'Search')}
        className={(state) =>
          cn(
            'border-city-border text-city-muted-foreground hover:bg-city-accent hover:text-city-accent-foreground active:bg-city-accent-active focus-visible:ring-city-ring/30 z-0 shrink-0 rounded-none border-l focus-visible:z-10 focus-visible:ring-offset-0',
            children == null && actionButtonSizeClasses[resolvedSize],
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

SearchFieldSubmit.displayName = 'SearchField.Submit';

export interface SearchFieldLoadingProps extends Omit<
  useRender.ComponentProps<'span', SearchFieldState>,
  'className'
> {
  className?: StateClassName<SearchFieldState>;
}

export const SearchFieldLoading = React.forwardRef<HTMLSpanElement, SearchFieldLoadingProps>(
  function SearchFieldLoading({ className, render, ...props }, ref) {
    const context = useSearchFieldContext('SearchField.Loading');
    const state: SearchFieldState = {
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

SearchFieldLoading.displayName = 'SearchField.Loading';

export const SearchField = {
  Root: SearchFieldRoot,
  Label: SearchFieldLabel,
  Group: SearchFieldGroup,
  Input: SearchFieldInput,
  Clear: SearchFieldClear,
  Submit: SearchFieldSubmit,
  Loading: SearchFieldLoading,
  Description: SearchFieldDescription,
  Error: SearchFieldError,
};
