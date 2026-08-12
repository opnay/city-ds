import type { FeedbackTone } from '../types';

interface FeedbackToneStyles {
  border: string;
  fill: string;
  fillForeground: string;
  indicator: string;
  surface: string;
}

export const feedbackToneStyles: Record<FeedbackTone, FeedbackToneStyles> = {
  neutral: {
    border: 'border-city-border',
    fill: 'bg-city-primary',
    fillForeground: 'text-city-primary-foreground',
    indicator: 'text-city-muted-foreground',
    surface: 'bg-city-muted',
  },
  info: {
    border: 'border-city-info-border',
    fill: 'bg-city-info',
    fillForeground: 'text-city-info-foreground',
    indicator: 'text-city-info',
    surface: 'bg-city-info-surface',
  },
  success: {
    border: 'border-city-success-border',
    fill: 'bg-city-success',
    fillForeground: 'text-city-success-foreground',
    indicator: 'text-city-success',
    surface: 'bg-city-success-surface',
  },
  warning: {
    border: 'border-city-warning-border',
    fill: 'bg-city-warning',
    fillForeground: 'text-city-warning-foreground',
    indicator: 'text-city-warning',
    surface: 'bg-city-warning-surface',
  },
  destructive: {
    border: 'border-city-destructive-border',
    fill: 'bg-city-destructive',
    fillForeground: 'text-city-destructive-foreground',
    indicator: 'text-city-destructive',
    surface: 'bg-city-destructive-surface',
  },
};
