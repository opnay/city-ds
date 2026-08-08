import type { ControlSize } from '../types';
import { atomicRectShapeClasses } from './atomic-shape';
import { atomicControlTextClasses } from './atomic-typography';
import { cn } from './cn';

export const outlineFrameBaseClasses = cn(
  atomicRectShapeClasses.control,
  'border-city-input bg-city-background text-city-foreground focus-within:border-city-ring focus-within:ring-city-ring/30 data-[invalid]:border-city-destructive data-[invalid]:focus-within:ring-city-destructive/30 flex w-full items-center overflow-hidden border transition-colors focus-within:ring-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
);

export const outlineFrameHeightClasses: Record<ControlSize, string> = {
  xsm: 'h-(--city-control-xsm)',
  sm: 'h-(--city-control-sm)',
  md: 'h-(--city-control-md)',
  lg: 'h-(--city-control-lg)',
  xlg: 'h-(--city-control-xlg)',
};

export const outlineFrameMinHeightClasses: Record<ControlSize, string> = {
  xsm: 'min-h-(--city-control-xsm)',
  sm: 'min-h-(--city-control-sm)',
  md: 'min-h-(--city-control-md)',
  lg: 'min-h-(--city-control-lg)',
  xlg: 'min-h-(--city-control-xlg)',
};

export const outlineFrameTextareaMinHeightClasses: Record<ControlSize, string> = {
  xsm: 'has-[textarea]:min-h-(--city-control-xsm)',
  sm: 'has-[textarea]:min-h-(--city-control-sm)',
  md: 'has-[textarea]:min-h-(--city-control-md)',
  lg: 'has-[textarea]:min-h-(--city-control-lg)',
  xlg: 'has-[textarea]:min-h-(--city-control-xlg)',
};

export const outlineFrameTextClasses = atomicControlTextClasses;

export const outlineFrameValuePaddingClasses: Record<ControlSize, string> = {
  xsm: 'px-1.5',
  sm: 'px-2',
  md: 'px-2.5',
  lg: 'px-3',
  xlg: 'px-3.5',
};

export const outlineFrameLeadingTextPaddingClasses: Record<ControlSize, string> = {
  xsm: 'pl-1.5',
  sm: 'pl-2',
  md: 'pl-2.5',
  lg: 'pl-3',
  xlg: 'pl-3.5',
};

export const outlineFrameTrailingIconPaddingClasses: Record<ControlSize, string> = {
  xsm: 'pr-1',
  sm: 'pr-1.5',
  md: 'pr-2',
  lg: 'pr-2.5',
  xlg: 'pr-3',
};

export const outlineFrameSegmentWidthClasses: Record<ControlSize, string> = {
  xsm: 'w-(--city-control-xsm)',
  sm: 'w-(--city-control-sm)',
  md: 'w-(--city-control-md)',
  lg: 'w-(--city-control-lg)',
  xlg: 'w-(--city-control-xlg)',
};
