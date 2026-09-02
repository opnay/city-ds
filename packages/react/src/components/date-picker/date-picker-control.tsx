'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';

import {
  compareLocalDates,
  formatLocalDate,
  normalizeLocalDate,
  parseLocalDate,
} from '../../lib/local-date';
import { cn } from '../../lib/cn';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

export interface DatePickerControlProps {
  defaultValue?: Date | null | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;
  isDateUnavailable?: ((date: Date) => boolean) | undefined;
  maxValue?: Date | undefined;
  minValue?: Date | undefined;
  name?: string | undefined;
  onValueChange?: ((value: Date | null) => void) | undefined;
  readOnly?: boolean | undefined;
  required?: boolean | undefined;
  size?: ControlSize | undefined;
  value?: Date | null | undefined;
}

export interface DatePickerControlContextValue {
  disabled: boolean;
  draft: string;
  inputInvalid: boolean;
  invalid: boolean;
  isDateUnavailable: ((date: Date) => boolean) | undefined;
  markTouched: () => void;
  maxValue: Date | undefined;
  minValue: Date | undefined;
  name: string | undefined;
  readOnly: boolean;
  required: boolean;
  setDraft: (draft: string) => void;
  setValue: (value: Date | null) => void;
  size: ControlSize;
  validationMessage: string;
  value: Date | null;
}

const DatePickerControlContext = React.createContext<DatePickerControlContextValue | null>(null);

export interface DatePickerControlRootState extends Record<string, unknown> {
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  required: boolean;
  size: ControlSize;
}

export interface DatePickerControlRootProps extends Omit<
  useRender.ComponentProps<'div', DatePickerControlRootState>,
  'className'
> {
  className?: StateClassName<DatePickerControlRootState>;
}

export function useDatePickerControl(component: string): DatePickerControlContextValue {
  const context = React.useContext(DatePickerControlContext);
  if (!context) {
    throw new Error(`${component} must be used within a date picker root`);
  }
  return context;
}

export const DatePickerControlRoot = React.forwardRef<HTMLDivElement, DatePickerControlRootProps>(
  function DatePickerControlRoot({ className, render, ...props }, ref) {
    const context = useDatePickerControl('DatePickerControl.Root');
    const state: DatePickerControlRootState = {
      disabled: context.disabled,
      invalid: context.invalid,
      readOnly: context.readOnly,
      required: context.required,
      size: context.size,
    };

    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      state,
      props: {
        ...props,
        'data-city-date-picker': '',
        'data-city-size': state.size,
        'data-disabled': state.disabled ? '' : undefined,
        'data-invalid': state.invalid ? '' : undefined,
        'data-readonly': state.readOnly ? '' : undefined,
        'data-required': state.required ? '' : undefined,
        className: cn('grid gap-1.5', resolveClassName(className, state)),
      },
    });
  },
);

DatePickerControlRoot.displayName = 'DatePickerControl.Root';

function getValidationMessage({
  disabled,
  draft,
  isDateUnavailable,
  maxValue,
  minValue,
  readOnly,
  required,
}: Pick<
  DatePickerControlContextValue,
  'disabled' | 'draft' | 'isDateUnavailable' | 'maxValue' | 'minValue' | 'readOnly' | 'required'
>): string {
  if (disabled || readOnly) return '';
  if (draft === '') return required ? 'Enter a date in YYYY-MM-DD format.' : '';

  const parsed = parseLocalDate(draft);
  if (!parsed) return 'Enter a valid date in YYYY-MM-DD format.';
  if (minValue && compareLocalDates(parsed, minValue) < 0) {
    return `Enter a date on or after ${formatLocalDate(minValue)}.`;
  }
  if (maxValue && compareLocalDates(parsed, maxValue) > 0) {
    return `Enter a date on or before ${formatLocalDate(maxValue)}.`;
  }
  if (isDateUnavailable?.(parsed)) return 'This date is unavailable.';
  return '';
}

interface DatePickerControlProviderProps extends DatePickerControlProps {
  children: React.ReactNode;
}

export function DatePickerControlProvider({
  children,
  defaultValue = null,
  disabled = false,
  invalid = false,
  isDateUnavailable,
  maxValue: maxValueProp,
  minValue: minValueProp,
  name,
  onValueChange,
  readOnly = false,
  required = false,
  size = 'md',
  value: valueProp,
}: DatePickerControlProviderProps): React.JSX.Element {
  const controlled = valueProp !== undefined;
  const normalizedValueProp = normalizeLocalDate(valueProp);
  const [uncontrolledValue, setUncontrolledValue] = React.useState<Date | null>(() =>
    normalizeLocalDate(defaultValue),
  );
  const value = controlled ? normalizedValueProp : uncontrolledValue;
  const valueKey = formatLocalDate(value);
  const minValue = normalizeLocalDate(minValueProp) ?? undefined;
  const maxValue = normalizeLocalDate(maxValueProp) ?? undefined;
  const [draft, setDraftState] = React.useState(valueKey);
  const [touched, setTouched] = React.useState(false);
  const lastValueKeyRef = React.useRef(valueKey);

  React.useEffect(() => {
    if (valueKey === lastValueKeyRef.current) return;

    lastValueKeyRef.current = valueKey;
    setDraftState(valueKey);
    setTouched(false);
  }, [valueKey]);

  const validationMessage = getValidationMessage({
    disabled,
    draft,
    isDateUnavailable,
    maxValue,
    minValue,
    readOnly,
    required,
  });

  function setValue(nextValue: Date | null) {
    if (disabled || readOnly) return;

    const normalized = normalizeLocalDate(nextValue);
    if (!controlled) setUncontrolledValue(normalized);
    setDraftState(formatLocalDate(normalized));
    onValueChange?.(normalized);
  }

  function setDraft(nextDraft: string) {
    if (disabled || readOnly) return;

    setDraftState(nextDraft);
    if (nextDraft === '') {
      setValue(null);
      return;
    }

    const parsed = parseLocalDate(nextDraft);
    if (!parsed) return;
    if (minValue && compareLocalDates(parsed, minValue) < 0) return;
    if (maxValue && compareLocalDates(parsed, maxValue) > 0) return;
    if (isDateUnavailable?.(parsed)) return;
    setValue(parsed);
  }

  const context: DatePickerControlContextValue = {
    disabled,
    draft,
    inputInvalid: touched && validationMessage !== '',
    invalid: invalid || (touched && validationMessage !== ''),
    isDateUnavailable,
    markTouched: () => setTouched(true),
    maxValue,
    minValue,
    name,
    readOnly,
    required,
    setDraft,
    setValue,
    size,
    validationMessage,
    value,
  };

  return (
    <DatePickerControlContext.Provider value={context}>
      {children}
    </DatePickerControlContext.Provider>
  );
}
