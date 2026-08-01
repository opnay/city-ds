'use client';

import * as React from 'react';

import {
  Field,
  type FieldDescriptionProps,
  type FieldErrorProps,
  type FieldLabelProps,
  type FieldRootProps,
} from '../field';
import { Input, type InputProps } from '../input';
import { cn } from '../../lib/cn';
import { DateControlProvider, type DateControlProps, useDateControl } from './date-control';

export interface DateFieldRootProps
  extends Omit<FieldRootProps, keyof DateControlProps>, DateControlProps {}

export const DateFieldRoot = React.forwardRef<HTMLDivElement, DateFieldRootProps>(
  function DateFieldRoot(
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
        <DateFieldRootContent {...props} ref={ref}>
          {children}
        </DateFieldRootContent>
      </DateControlProvider>
    );
  },
);

DateFieldRoot.displayName = 'DateField.Root';

const DateFieldRootContent = React.forwardRef<HTMLDivElement, FieldRootProps>(
  function DateFieldRootContent(props, ref) {
    const context = useDateControl('DateField.Root');
    return (
      <Field.Root {...props} ref={ref} disabled={context.disabled} invalid={context.invalid} />
    );
  },
);

export const DateFieldLabel = Field.Label;
export type DateFieldLabelProps = FieldLabelProps;

export const DateFieldDescription = Field.Description;
export type DateFieldDescriptionProps = FieldDescriptionProps;

export type DateFieldErrorProps = FieldErrorProps;

export const DateFieldError = React.forwardRef<HTMLDivElement, DateFieldErrorProps>(
  function DateFieldError({ match, ...props }, ref) {
    const context = useDateControl('DateField.Error');

    return <Field.Error {...props} ref={ref} match={match ?? context.invalid} />;
  },
);

DateFieldError.displayName = 'DateField.Error';

export type DateFieldInputProps = Omit<
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

export const DateFieldInput = React.forwardRef<HTMLElement, DateFieldInputProps>(
  function DateFieldInput(
    { className, inputMode = 'numeric', onBlur, onInvalid, placeholder = 'YYYY-MM-DD', ...props },
    forwardedRef,
  ) {
    const context = useDateControl('DateField.Input');
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
        aria-invalid={context.inputInvalid || undefined}
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

DateFieldInput.displayName = 'DateField.Input';

export const DateField = {
  Root: DateFieldRoot,
  Label: DateFieldLabel,
  Input: DateFieldInput,
  Description: DateFieldDescription,
  Error: DateFieldError,
};

export type { DateControlProps };
