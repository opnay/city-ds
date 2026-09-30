import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Alert } from '../../src/components/alert';

describe('Alert', () => {
  it('connects title and description and uses polite status defaults for informational messages', () => {
    render(
      <Alert.Root variant="info">
        <Alert.Title>Dataset synced</Alert.Title>
        <Alert.Description>Records are ready.</Alert.Description>
      </Alert.Root>,
    );

    const status = screen.getByRole('status', {
      name: 'Dataset synced',
      description: 'Records are ready.',
    });

    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('data-city-alert-root');
    expect(status).toHaveAttribute('data-appearance', 'subtle');
    expect(status).toHaveAttribute('data-tone', 'info');
    expect(status).toHaveAttribute('data-variant', 'info');
    expect(status).toHaveAccessibleDescription('Records are ready.');
    expect(status).toHaveClass('border-city-info-border', 'bg-city-info-surface');
    expect(status.querySelector('span[aria-hidden="true"]')).toHaveClass('text-city-info');
  });

  it('gives success and warning messages distinct semantic treatments', () => {
    render(
      <>
        <Alert.Root variant="success">
          <Alert.Title>Sync complete</Alert.Title>
        </Alert.Root>
        <Alert.Root variant="warning">
          <Alert.Title>SLA at risk</Alert.Title>
        </Alert.Root>
      </>,
    );

    const success = screen.getByRole('status', { name: 'Sync complete' });
    const warning = screen.getByRole('status', { name: 'SLA at risk' });

    expect(success).toHaveClass('border-city-success-border', 'bg-city-success-surface');
    expect(success.querySelector('span[aria-hidden="true"]')).toHaveClass('text-city-success');
    expect(warning).toHaveClass('border-city-warning-border', 'bg-city-warning-surface');
    expect(warning.querySelector('span[aria-hidden="true"]')).toHaveClass('text-city-warning');
  });

  it('uses assertive alert defaults for errors and allows live region overrides', () => {
    render(
      <>
        <Alert.Root variant="error">
          <Alert.Title>Import failed</Alert.Title>
          <Alert.Description>Fix the source file and try again.</Alert.Description>
        </Alert.Root>
        <Alert.Root aria-live="polite" role="status" variant="error">
          <Alert.Title>Background retry failed</Alert.Title>
          <Alert.Description>The scheduled retry will continue later.</Alert.Description>
        </Alert.Root>
      </>,
    );

    expect(screen.getByRole('alert', { name: 'Import failed' })).toHaveAttribute(
      'aria-live',
      'assertive',
    );
    expect(screen.getByText('Fix the source file and try again.')).toHaveClass(
      'text-city-foreground',
    );
    expect(screen.getByRole('status', { name: 'Background retry failed' })).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  it('separates feedback tone from visual appearance while keeping legacy variants', () => {
    render(
      <>
        <Alert.Root appearance="outline" tone="destructive">
          <Alert.Title>Connection lost</Alert.Title>
        </Alert.Root>
        <Alert.Root tone="neutral">
          <Alert.Title>Scheduled update</Alert.Title>
        </Alert.Root>
      </>,
    );

    const destructive = screen.getByRole('alert', { name: 'Connection lost' });
    const neutral = screen.getByRole('status', { name: 'Scheduled update' });

    expect(destructive).toHaveAttribute('data-tone', 'destructive');
    expect(destructive).toHaveAttribute('data-appearance', 'outline');
    expect(destructive).toHaveAttribute('data-variant', 'error');
    expect(destructive).toHaveClass('border-city-destructive-border', 'bg-city-background');
    expect(destructive).not.toHaveClass('bg-city-surface-raised');
    expect(neutral).toHaveAttribute('data-tone', 'neutral');
    expect(neutral).toHaveAttribute('data-variant', 'info');
  });
});
