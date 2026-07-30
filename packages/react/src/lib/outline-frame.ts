import type { ControlSize } from '../types';

export const outlineFrameBaseClasses =
  'rounded-city-sm border-city-input bg-city-background text-city-foreground focus-within:border-city-ring focus-within:ring-city-ring/30 data-[invalid]:border-city-destructive data-[invalid]:focus-within:ring-city-destructive/30 flex w-full items-center overflow-hidden border transition-colors focus-within:ring-2 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50';

export const outlineFrameHeightClasses: Record<ControlSize, string> = {
  sm: 'h-(--city-control-sm)',
  md: 'h-(--city-control-md)',
  lg: 'h-(--city-control-lg)',
};

export const outlineFrameMinHeightClasses: Record<ControlSize, string> = {
  sm: 'min-h-(--city-control-sm)',
  md: 'min-h-(--city-control-md)',
  lg: 'min-h-(--city-control-lg)',
};

export const outlineFrameTextareaMinHeightClasses: Record<ControlSize, string> = {
  sm: 'has-[textarea]:min-h-(--city-control-sm)',
  md: 'has-[textarea]:min-h-(--city-control-md)',
  lg: 'has-[textarea]:min-h-(--city-control-lg)',
};

export const outlineFrameTextClasses: Record<ControlSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
};

export const outlineFrameSegmentWidthClasses: Record<ControlSize, string> = {
  sm: 'w-(--city-control-sm)',
  md: 'w-(--city-control-md)',
  lg: 'w-(--city-control-lg)',
};
