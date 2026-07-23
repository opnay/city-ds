export const CITY_THEMES = ['light', 'dark', 'system'] as const;

export type CityTheme = (typeof CITY_THEMES)[number];
