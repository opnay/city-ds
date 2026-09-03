import type { ComponentType } from 'react';

export type PreviewOptionProps = Readonly<Record<string, boolean | string>>;

export type PreviewPlaygroundComponent = ComponentType<PreviewOptionProps>;

export type ControlSize = 'xsm' | 'sm' | 'md' | 'lg' | 'xlg';

export function isEnabled(value: boolean | string | undefined) {
  return value === true || value === 'true';
}

export function isControlled(value: boolean | string | undefined) {
  return value === 'controlled';
}

export function toControlSize(value: boolean | string | undefined): ControlSize {
  return typeof value === 'string' && ['xsm', 'sm', 'md', 'lg', 'xlg'].includes(value)
    ? (value as ControlSize)
    : 'md';
}
