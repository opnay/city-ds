'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { CalendarDays } from 'lucide-react';

import { Calendar, type CalendarProps } from '../calendar';
import { Input, type InputProps } from '../input';
import {
  DatePickerControlProvider,
  DatePickerControlRoot,
  type DatePickerControlProps,
  type DatePickerControlRootProps,
  useDatePickerControl,
} from './date-picker-control';
import {
  Popover,
  type PopoverPopupProps,
  type PopoverPortalProps,
  type PopoverPositionerProps,
  type PopoverRootProps,
  type PopoverTriggerProps,
} from '../popover';
import { cn } from '../../lib/cn';
import {
  outlineFrameBaseClasses,
  outlineFrameHeightClasses,
  outlineFrameSegmentWidthClasses,
  outlineFrameTextClasses,
} from '../../lib/outline-frame';
import { resolveClassName, type StateClassName } from '../../lib/resolve-class-name';
import type { ControlSize } from '../../types';

type PopoverActions = {
  close: () => void;
  unmount: () => void;
};

type DatePickerContextValue = {
  close: () => void;
  open: boolean;
};

const DatePickerContext = React.createContext<DatePickerContextValue | null>(null);

function useDatePickerContext(component: string): DatePickerContextValue {
  const context = React.useContext(DatePickerContext);
  if (!context) throw new Error(`${component} must be used within DatePicker.Root`);
  return context;
}

export interface DatePickerRootProps
  extends Omit<DatePickerControlRootProps, keyof DatePickerControlProps>, DatePickerControlProps {
  defaultOpen?: boolean | undefined;
  onOpenChange?: PopoverRootProps['onOpenChange'];
  open?: boolean | undefined;
}

export const DatePickerRoot = React.forwardRef<HTMLDivElement, DatePickerRootProps>(
  function DatePickerRoot(
    {
      children,
      defaultOpen,
      defaultValue,
      disabled,
      invalid,
      isDateUnavailable,
      maxValue,
      minValue,
      name,
      onOpenChange,
      onValueChange,
      open,
      readOnly,
      required,
      size,
      value,
      ...props
    },
    ref,
  ) {
    return (
      <DatePickerControlProvider
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
        <DatePickerRootContent
          {...props}
          ref={ref}
          defaultOpen={defaultOpen}
          onOpenChange={onOpenChange}
          open={open}
        >
          {children}
        </DatePickerRootContent>
      </DatePickerControlProvider>
    );
  },
);

DatePickerRoot.displayName = 'DatePicker.Root';

interface DatePickerRootContentProps extends DatePickerControlRootProps {
  defaultOpen?: boolean | undefined;
  onOpenChange?: PopoverRootProps['onOpenChange'];
  open?: boolean | undefined;
}

const DatePickerRootContent = React.forwardRef<HTMLDivElement, DatePickerRootContentProps>(
  function DatePickerRootContent(
    { children, defaultOpen = false, onOpenChange, open: openProp, ...props },
    ref,
  ) {
    const controlled = openProp !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = controlled ? openProp : uncontrolledOpen;
    const actionsRef = React.useRef<PopoverActions | null>(null);

    const context: DatePickerContextValue = {
      close: () => actionsRef.current?.close(),
      open,
    };

    return (
      <DatePickerContext.Provider value={context}>
        <DatePickerControlRoot {...props} ref={ref}>
          <Popover.Root
            actionsRef={actionsRef}
            open={open}
            onOpenChange={(nextOpen, details) => {
              if (!controlled) setUncontrolledOpen(nextOpen);
              onOpenChange?.(nextOpen, details);
            }}
          >
            {children}
          </Popover.Root>
        </DatePickerControlRoot>
      </DatePickerContext.Provider>
    );
  },
);

export type DatePickerInputProps = Omit<
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

export const DatePickerInput = React.forwardRef<HTMLElement, DatePickerInputProps>(
  function DatePickerInput(
    { className, inputMode = 'numeric', onBlur, onInvalid, placeholder = 'YYYY-MM-DD', ...props },
    forwardedRef,
  ) {
    const dateControl = useDatePickerControl('DatePicker.Input');
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
      inputRef.current?.setCustomValidity(dateControl.validationMessage);
    }, [dateControl.validationMessage]);

    return (
      <Input
        {...props}
        ref={setRefs}
        aria-invalid={dateControl.invalid || dateControl.inputInvalid || undefined}
        className={(state) =>
          cn(
            'font-mono tabular-nums',
            typeof className === 'function' ? className(state) : className,
          )
        }
        disabled={dateControl.disabled}
        inputMode={inputMode}
        maxLength={10}
        name={dateControl.name}
        onBlur={(event) => {
          onBlur?.(event);
          dateControl.markTouched();
        }}
        onInvalid={(event) => {
          onInvalid?.(event);
          dateControl.markTouched();
        }}
        onValueChange={(nextValue) => dateControl.setDraft(nextValue)}
        placeholder={placeholder}
        readOnly={dateControl.readOnly}
        required={dateControl.required}
        size={dateControl.size}
        type="text"
        value={dateControl.draft}
      />
    );
  },
);

DatePickerInput.displayName = 'DatePicker.Input';

export type DatePickerGroupState = {
  disabled: boolean;
  invalid: boolean;
  open: boolean;
  readOnly: boolean;
  size: ControlSize;
};

export interface DatePickerGroupProps extends Omit<
  useRender.ComponentProps<'div', DatePickerGroupState>,
  'className'
> {
  className?: StateClassName<DatePickerGroupState>;
}

export const DatePickerGroup = React.forwardRef<HTMLDivElement, DatePickerGroupProps>(
  function DatePickerGroup({ className, render, ...props }, ref) {
    const dateControl = useDatePickerControl('DatePicker.Group');
    const datePicker = useDatePickerContext('DatePicker.Group');
    const state: DatePickerGroupState = {
      disabled: dateControl.disabled,
      invalid: dateControl.invalid,
      open: datePicker.open,
      readOnly: dateControl.readOnly,
      size: dateControl.size,
    };

    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      state,
      props: {
        ...props,
        'data-city-size': state.size,
        'data-disabled': state.disabled ? '' : undefined,
        'data-invalid': state.invalid ? '' : undefined,
        'data-open': state.open ? '' : undefined,
        'data-readonly': state.readOnly ? '' : undefined,
        className: cn(
          outlineFrameBaseClasses,
          outlineFrameHeightClasses[state.size],
          outlineFrameTextClasses[state.size],
          '[&>input]:h-full [&>input]:self-stretch [&>input]:rounded-none [&>input]:border-0 [&>input]:bg-transparent [&>input]:focus-visible:ring-0',
          resolveClassName(className, state),
        ),
      },
    });
  },
);

DatePickerGroup.displayName = 'DatePicker.Group';

export type DatePickerTriggerProps = PopoverTriggerProps;

const triggerIconSizes: Record<ControlSize, number> = {
  xsm: 12,
  sm: 14,
  md: 14,
  lg: 16,
  xlg: 16,
};

export const DatePickerTrigger = React.forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
  function DatePickerTrigger(
    { 'aria-label': ariaLabel = 'Open calendar', children, className, disabled, render, ...props },
    ref,
  ) {
    const dateControl = useDatePickerControl('DatePicker.Trigger');
    const size = dateControl.size;

    return (
      <Popover.Trigger
        {...props}
        ref={ref}
        aria-label={ariaLabel}
        className={(state) =>
          cn(
            'border-city-border text-city-muted-foreground hover:bg-city-accent hover:text-city-foreground active:bg-city-accent-active focus-visible:ring-city-ring inline-flex h-full shrink-0 items-center justify-center self-stretch border-l transition-colors outline-none focus-visible:z-10 focus-visible:ring-2 disabled:pointer-events-none',
            outlineFrameSegmentWidthClasses[size],
            resolveClassName(className, state),
          )
        }
        disabled={dateControl.disabled || disabled}
        render={render ?? <button type="button" />}
      >
        {children ?? (
          <CalendarDays aria-hidden="true" size={triggerIconSizes[size]} strokeWidth={1.8} />
        )}
      </Popover.Trigger>
    );
  },
);

DatePickerTrigger.displayName = 'DatePicker.Trigger';

export type DatePickerPortalProps = PopoverPortalProps;
export const DatePickerPortal = Popover.Portal;

export type DatePickerPositionerProps = PopoverPositionerProps;

export const DatePickerPositioner = React.forwardRef<HTMLDivElement, DatePickerPositionerProps>(
  function DatePickerPositioner(
    { align = 'start', collisionPadding = 8, sideOffset = 6, ...props },
    ref,
  ) {
    return (
      <Popover.Positioner
        {...props}
        ref={ref}
        align={align}
        collisionPadding={collisionPadding}
        sideOffset={sideOffset}
      />
    );
  },
);

DatePickerPositioner.displayName = 'DatePicker.Positioner';

export type DatePickerPopupProps = PopoverPopupProps;

export const DatePickerPopup = React.forwardRef<HTMLDivElement, DatePickerPopupProps>(
  function DatePickerPopup({ 'aria-label': ariaLabel = 'Choose date', className, ...props }, ref) {
    return (
      <Popover.Popup
        {...props}
        ref={ref}
        aria-label={ariaLabel}
        className={(state) =>
          cn(
            'max-h-(--available-height) w-auto overflow-y-auto overscroll-contain p-3',
            resolveClassName(className, state),
          )
        }
      />
    );
  },
);

DatePickerPopup.displayName = 'DatePicker.Popup';

export interface DatePickerCalendarProps extends Omit<
  CalendarProps,
  | 'defaultValue'
  | 'disabled'
  | 'isDateUnavailable'
  | 'maxValue'
  | 'minValue'
  | 'onValueChange'
  | 'readOnly'
  | 'required'
  | 'value'
> {
  onValueChange?: CalendarProps['onValueChange'];
}

export function DatePickerCalendar({
  autoFocus,
  invalid,
  onValueChange,
  size,
  ...props
}: DatePickerCalendarProps): React.JSX.Element {
  const dateControl = useDatePickerControl('DatePicker.Calendar');
  const datePicker = useDatePickerContext('DatePicker.Calendar');

  return (
    <Calendar
      {...props}
      autoFocus={autoFocus ?? datePicker.open}
      disabled={dateControl.disabled}
      invalid={dateControl.invalid || invalid === true}
      onValueChange={(nextValue) => {
        dateControl.setValue(nextValue);
        onValueChange?.(nextValue);
        datePicker.close();
      }}
      readOnly={dateControl.readOnly}
      required={dateControl.required}
      size={size ?? dateControl.size}
      value={dateControl.value}
      {...(dateControl.isDateUnavailable
        ? { isDateUnavailable: dateControl.isDateUnavailable }
        : {})}
      {...(dateControl.maxValue ? { maxValue: dateControl.maxValue } : {})}
      {...(dateControl.minValue ? { minValue: dateControl.minValue } : {})}
    />
  );
}

export const DatePicker = {
  Root: DatePickerRoot,
  Group: DatePickerGroup,
  Input: DatePickerInput,
  Trigger: DatePickerTrigger,
  Portal: DatePickerPortal,
  Positioner: DatePickerPositioner,
  Popup: DatePickerPopup,
  Calendar: DatePickerCalendar,
};
