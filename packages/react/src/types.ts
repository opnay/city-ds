export const CONTROL_SIZES = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;
export const DENSITIES = ['comfortable', 'compact'] as const;
export const FEEDBACK_TONES = ['neutral', 'info', 'success', 'warning', 'destructive'] as const;
export const SURFACE_APPEARANCES = ['plain', 'band', 'outline'] as const;

export type ControlSize = (typeof CONTROL_SIZES)[number];
export type Density = (typeof DENSITIES)[number];
export type FeedbackTone = (typeof FEEDBACK_TONES)[number];
export type SurfaceAppearance = (typeof SURFACE_APPEARANCES)[number];
