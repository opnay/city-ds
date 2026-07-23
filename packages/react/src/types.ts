export const CONTROL_SIZES = ['sm', 'md', 'lg'] as const;

export type ControlSize = (typeof CONTROL_SIZES)[number];
