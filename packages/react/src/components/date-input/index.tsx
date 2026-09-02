'use client';

import * as React from 'react';

import { Input, type InputProps } from '../input';
import { cn } from '../../lib/cn';
import {
  DateControlProvider,
  DateControlRoot,
  type DateControlProps,
  type DateControlRootProps,
  useDateControl,
} from '../../lib/date-control';

export interface DateInputRootProps
  extends Omit<DateControlRootProps, keyof DateControlProps>, DateControlProps {}

export const DateInputRoot = React.forwardRef<HTMLDivElement, DateInputRootProps>(
  function DateInputRoot(
    {
      children,
      defaultValue,
      disabled,
      invalid,
      isDateUnavailable,
      maxValue,
      minValue,
      name,
      onValueChange,
      readOnly,
      required,
      size,
      value,
      ...props
    },
    ref,
  ) {
    return (
      <DateControlProvider
        defaultValue={defaultValue}
        disabled={disabled}
        invalid={invalid}
        isDateUnavailable={isDateUnavailable}
        maxValue={maxValue}
        minValue={minValue}
        name={name}
        onValueChange={onValueChange}
        readOnly={readOnly}
        required={required}
        size={size}
        value={value}
      >
        <DateControlRoot {...props} ref={ref}>
          {children}
        </DateControlRoot>
      </DateControlProvider>
    );
  },
);

DateInputRoot.displayName = 'DateInput.Root';

export type DateInputInputProps = Omit<
  InputProps,
  | 'defaultValue'
  | 'disabled'
  | 'maxLength'
  | 'name'
  | 'onValueChange'
  | 'readOnly'
  | 'required'
  | 'size'
  | 'type'
  | 'value'
>;

export const DateInputInput = React.forwardRef<HTMLElement, DateInputInputProps>(
  function DateInputInput(
    { className, inputMode = 'numeric', onBlur, onInvalid, placeholder = 'YYYY-MM-DD', ...props },
    forwardedRef,
  ) {
    const context = useDateControl('DateInput.Input');
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLElement | null) => {
        inputRef.current = node as HTMLInputElement | null;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef],
    );

    React.useEffect(() => {
      inputRef.current?.setCustomValidity(context.validationMessage);
    }, [context.validationMessage]);

    return (
      <Input
        {...props}
        ref={setRefs}
        aria-invalid={context.invalid || context.inputInvalid || undefined}
        className={(state) =>
          cn(
            'font-mono tabular-nums',
            typeof className === 'function' ? className(state) : className,
          )
        }
        disabled={context.disabled}
        inputMode={inputMode}
        maxLength={10}
        name={context.name}
        onBlur={(event) => {
          onBlur?.(event);
          context.markTouched();
        }}
        onInvalid={(event) => {
          onInvalid?.(event);
          context.markTouched();
        }}
        onValueChange={(nextValue) => context.setDraft(nextValue)}
        placeholder={placeholder}
        readOnly={context.readOnly}
        required={context.required}
        size={context.size}
        type="text"
        value={context.draft}
      />
    );
  },
);

DateInputInput.displayName = 'DateInput.Input';

export const DateInput = {
  Root: DateInputRoot,
  Input: DateInputInput,
};

export type { DateControlProps };
