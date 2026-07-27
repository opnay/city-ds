export const CONTROL_SIZES = ['sm', 'md', 'lg'] as const;
export const DENSITIES = ['comfortable', 'compact'] as const;
export const SURFACE_APPEARANCES = ['plain', 'band', 'outline'] as const;

export type ControlSize = (typeof CONTROL_SIZES)[number];
export type Density = (typeof DENSITIES)[number];
export type SurfaceAppearance = (typeof SURFACE_APPEARANCES)[number];
