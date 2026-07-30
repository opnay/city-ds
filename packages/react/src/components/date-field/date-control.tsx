'use client';

import * as React from 'react';

import {
  compareLocalDates,
  formatLocalDate,
  normalizeLocalDate,
  parseLocalDate,
} from '../../lib/local-date';
import type { ControlSize } from '../../types';

export interface DateControlProps {
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

export interface DateControlContextValue {
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

const DateControlContext = React.createContext<DateControlContextValue | null>(null);

export function useDateControl(component: string): DateControlContextValue {
  const context = React.useContext(DateControlContext);
  if (!context) {
    throw new Error(`${component} must be used within a date control root`);
  }
  return context;
}

function getValidationMessage({
  disabled,
  draft,
  isDateUnavailable,
  maxValue,
  minValue,
  readOnly,
  required,
}: Pick<
  DateControlContextValue,
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

interface DateControlProviderProps extends DateControlProps {
  children: React.ReactNode;
}

export function DateControlProvider({
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
}: DateControlProviderProps): React.JSX.Element {
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

  const context: DateControlContextValue = {
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

  return <DateControlContext.Provider value={context}>{children}</DateControlContext.Provider>;
}
