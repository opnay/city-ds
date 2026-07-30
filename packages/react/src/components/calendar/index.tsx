'use client';

import * as React from 'react';
import {
  DayFlag,
  DayPicker,
  SelectionState,
  UI,
  type ChevronProps,
  type ClassNames,
  type Formatters,
  type Labels,
  type Matcher,
  type MonthChangeEventHandler,
  type PropsBase as DayPickerBaseProps,
} from '@daypicker/react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';

import { cn } from '../../lib/cn';
import { createLocalDate, normalizeLocalDate } from '../../lib/local-date';
import type { ControlSize } from '../../types';

export interface CalendarProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  autoFocus?: boolean;
  captionLayout?: DayPickerBaseProps['captionLayout'];
  className?: string;
  defaultMonth?: Date;
  defaultValue?: Date | null;
  dir?: DayPickerBaseProps['dir'];
  disabled?: boolean;
  footer?: React.ReactNode | string;
  formatters?: Partial<Formatters>;
  id?: string;
  invalid?: boolean;
  isDateUnavailable?: (date: Date) => boolean;
  labels?: Partial<Labels>;
  lang?: string;
  locale?: DayPickerBaseProps['locale'];
  maxValue?: Date;
  minValue?: Date;
  month?: Date;
  onMonthChange?: MonthChangeEventHandler;
  onValueChange?: (value: Date | null) => void;
  readOnly?: boolean;
  required?: boolean;
  role?: DayPickerBaseProps['role'];
  showOutsideDays?: boolean;
  size?: ControlSize;
  today?: Date;
  value?: Date | null;
  weekStartsOn?: DayPickerBaseProps['weekStartsOn'];
}

const cellSizeClasses: Record<ControlSize, string> = {
  sm: 'size-(--city-control-sm)',
  md: 'size-(--city-control-md)',
  lg: 'size-(--city-control-lg)',
};

const captionSizeClasses: Record<ControlSize, string> = {
  sm: 'h-(--city-control-sm)',
  md: 'h-(--city-control-md)',
  lg: 'h-(--city-control-lg)',
};

const textSizeClasses: Record<ControlSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
};

function CalendarChevron({
  className,
  disabled,
  orientation = 'left',
  size = 16,
  style,
}: ChevronProps): React.JSX.Element {
  const Icon =
    orientation === 'down'
      ? ChevronDown
      : orientation === 'up'
        ? ChevronUp
        : orientation === 'right'
          ? ChevronRight
          : ChevronLeft;

  return (
    <Icon
      aria-hidden="true"
      className={className}
      opacity={disabled ? 0.5 : undefined}
      size={size}
      strokeWidth={1.8}
      style={style}
    />
  );
}

function getCalendarClassNames(size: ControlSize): Partial<ClassNames> {
  const cellSize = cellSizeClasses[size];
  const captionSize = captionSizeClasses[size];
  const textSize = textSizeClasses[size];

  return {
    [UI.Root]: 'relative w-fit select-none',
    [UI.Months]: 'relative flex flex-col gap-4',
    [UI.Month]: 'flex flex-col gap-2',
    [UI.MonthCaption]: cn('flex items-center justify-center px-10', captionSize),
    [UI.CaptionLabel]: cn('font-medium', textSize),
    [UI.Dropdowns]: 'flex items-center justify-center gap-1.5',
    [UI.DropdownRoot]: 'relative',
    [UI.Dropdown]:
      'border-city-input bg-city-background text-city-foreground focus-visible:ring-city-ring rounded-city-sm h-7 appearance-none border px-2 pr-6 text-xs outline-none focus-visible:ring-2',
    [UI.Nav]: cn(
      'pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between',
      captionSize,
    ),
    [UI.PreviousMonthButton]: cn(
      'text-city-muted-foreground hover:bg-city-accent hover:text-city-foreground active:bg-city-accent-active focus-visible:ring-city-ring pointer-events-auto inline-flex items-center justify-center rounded-city-sm outline-none transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-40',
      cellSize,
    ),
    [UI.NextMonthButton]: cn(
      'text-city-muted-foreground hover:bg-city-accent hover:text-city-foreground active:bg-city-accent-active focus-visible:ring-city-ring pointer-events-auto inline-flex items-center justify-center rounded-city-sm outline-none transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-40',
      cellSize,
    ),
    [UI.MonthGrid]: 'w-full border-collapse',
    [UI.Weekday]: cn('text-city-muted-foreground p-0 text-center font-normal', cellSize, textSize),
    [UI.Day]: cn('p-0 text-center align-middle', cellSize),
    [UI.DayButton]: cn(
      'hover:bg-city-accent active:bg-city-accent-active focus-visible:ring-city-ring inline-flex items-center justify-center rounded-city-sm outline-none transition-colors focus-visible:z-10 focus-visible:ring-2',
      cellSize,
      textSize,
    ),
    [DayFlag.today]:
      '[&>button]:ring-city-ring/40 [&>button]:font-semibold [&>button]:ring-1 [&>button]:ring-inset',
    [DayFlag.outside]: '[&>button]:text-city-muted-foreground',
    [DayFlag.disabled]:
      '[&>button]:pointer-events-none [&>button]:cursor-not-allowed [&>button]:opacity-35',
    [DayFlag.hidden]: 'invisible',
    [SelectionState.selected]:
      '[&>button]:bg-city-primary [&>button]:text-city-primary-foreground [&>button]:hover:bg-city-primary/90 [&>button]:ring-0',
  };
}

function startOfMonth(value: Date): Date {
  return createLocalDate(value.getFullYear(), value.getMonth() + 1, 1);
}

export function Calendar({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  autoFocus,
  captionLayout = 'label',
  className,
  defaultMonth,
  defaultValue = null,
  dir,
  disabled = false,
  footer,
  formatters,
  id,
  invalid = false,
  isDateUnavailable,
  labels,
  lang,
  locale,
  maxValue: maxValueProp,
  minValue: minValueProp,
  month: monthProp,
  onMonthChange,
  onValueChange,
  readOnly = false,
  required = false,
  role,
  showOutsideDays = true,
  size = 'md',
  today: todayProp,
  value: valueProp,
  weekStartsOn,
}: CalendarProps): React.JSX.Element {
  const controlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState<Date | null>(() =>
    normalizeLocalDate(defaultValue),
  );
  const value = controlled ? normalizeLocalDate(valueProp) : uncontrolledValue;
  const minValue = normalizeLocalDate(minValueProp) ?? undefined;
  const maxValue = normalizeLocalDate(maxValueProp) ?? undefined;
  const today = normalizeLocalDate(todayProp) ?? undefined;
  const controlledMonth = normalizeLocalDate(monthProp) ?? undefined;
  const [uncontrolledMonth, setUncontrolledMonth] = React.useState<Date>(
    () => normalizeLocalDate(defaultMonth ?? value ?? today ?? new Date()) ?? new Date(),
  );
  const month = controlledMonth ?? uncontrolledMonth;

  const handleMonthChange = React.useCallback(
    (nextMonth: Date) => {
      const normalized = normalizeLocalDate(nextMonth);
      if (!normalized) return;
      if (!controlledMonth) setUncontrolledMonth(normalized);
      onMonthChange?.(normalized);
    },
    [controlledMonth, onMonthChange],
  );

  const handleValueChange = React.useCallback(
    (nextValue: Date | undefined) => {
      if (disabled || readOnly) return;

      const normalized = normalizeLocalDate(nextValue);
      if (!controlled) setUncontrolledValue(normalized);
      if (normalized && !controlledMonth) setUncontrolledMonth(normalized);
      onValueChange?.(normalized);
    },
    [controlled, controlledMonth, disabled, onValueChange, readOnly],
  );

  const disabledMatchers = React.useMemo<Matcher[]>(() => {
    if (disabled) return [true];

    const matchers: Matcher[] = [];
    if (minValue) matchers.push({ before: minValue });
    if (maxValue) matchers.push({ after: maxValue });
    if (isDateUnavailable) matchers.push(isDateUnavailable);
    return matchers;
  }, [disabled, isDateUnavailable, maxValue, minValue]);

  const resolvedAriaLabel = ariaLabel ?? (ariaLabelledBy ? undefined : 'Calendar');
  const resolvedLabels: Partial<Labels> = {
    labelNav: () => `${resolvedAriaLabel ?? 'Calendar'} navigation`,
    ...labels,
  };
  const commonProps = {
    captionLayout,
    className: cn(
      'text-city-foreground',
      invalid && 'ring-city-destructive/30 rounded-city-md ring-2',
      className,
    ),
    classNames: getCalendarClassNames(size),
    components: { Chevron: CalendarChevron },
    disableNavigation: disabled,
    disabled: disabledMatchers,
    month,
    navLayout: 'after' as const,
    onMonthChange: handleMonthChange,
    showOutsideDays,
    ...(resolvedAriaLabel ? { 'aria-label': resolvedAriaLabel } : {}),
    ...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : {}),
    ...(autoFocus === undefined ? {} : { autoFocus }),
    ...(dir ? { dir } : {}),
    ...(footer === undefined ? {} : { footer }),
    ...(formatters ? { formatters } : {}),
    ...(id ? { id } : {}),
    labels: resolvedLabels,
    ...(lang ? { lang } : {}),
    ...(locale ? { locale } : {}),
    ...(role ? { role } : {}),
    ...(minValue ? { startMonth: startOfMonth(minValue) } : {}),
    ...(maxValue ? { endMonth: startOfMonth(maxValue) } : {}),
    ...(today ? { today } : {}),
    ...(weekStartsOn === undefined ? {} : { weekStartsOn }),
  };

  if (required) {
    return (
      <DayPicker
        {...commonProps}
        mode="single"
        onSelect={(nextValue) => handleValueChange(nextValue)}
        required
        selected={value ?? undefined}
      />
    );
  }

  return (
    <DayPicker
      {...commonProps}
      mode="single"
      onSelect={(nextValue) => handleValueChange(nextValue)}
      selected={value ?? undefined}
    />
  );
}
