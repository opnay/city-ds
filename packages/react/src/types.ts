export const CONTROL_SIZES = ['sm', 'md', 'lg'] as const;
export const DENSITIES = ['comfortable', 'compact'] as const;

export type ControlSize = (typeof CONTROL_SIZES)[number];
export type Density = (typeof DENSITIES)[number];
