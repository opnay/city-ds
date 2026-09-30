import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from '../../src/components/badge';

describe('Badge', () => {
  it('renders Badge through the Base UI render API', () => {
    render(
      <>
        <Badge render={<a href="/release" />} variant="outline">
          v1
        </Badge>
        <Badge aria-hidden="true" count={7} size="sm" variant="destructive" />
        <Badge data-testid="status-dot" dot />
        <Badge appearance="outline" tone="warning">
          Attention
        </Badge>
        <Badge aria-label="Healthy" data-testid="success-dot" dot tone="success" />
        <Badge appearance="solid" data-testid="success-solid" tone="success">
          Healthy
        </Badge>
      </>,
    );

    expect(screen.getByRole('link', { name: 'v1' })).toHaveAttribute('href', '/release');
    expect(screen.getByRole('link', { name: 'v1' })).toHaveClass('border-city-border');
    expect(screen.getByRole('link', { name: 'v1' })).toHaveAttribute('data-city-badge', 'label');
    expect(screen.getByText('7')).toHaveAttribute('data-city-badge', 'count');
    expect(screen.getByText('7')).toHaveAttribute('data-city-size', 'sm');
    expect(screen.getByText('7')).toHaveClass('h-5', 'min-w-5', 'rounded-city-full');
    expect(screen.getByText('7')).not.toHaveClass('rounded-city-xs');
    expect(screen.getByTestId('status-dot')).toHaveAttribute('data-city-badge', 'dot');
    expect(screen.getByTestId('status-dot')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('status-dot')).toHaveClass('size-2', 'rounded-city-full');
    expect(screen.getByTestId('status-dot')).not.toHaveClass('rounded-city-xs');
    expect(screen.getByText('Attention')).toHaveAttribute('data-appearance', 'outline');
    expect(screen.getByText('Attention')).toHaveAttribute('data-tone', 'warning');
    expect(screen.getByText('Attention')).toHaveClass('border-city-warning-border');
    expect(screen.getByTestId('success-dot')).toHaveAttribute('data-tone', 'success');
    expect(screen.getByTestId('success-dot')).toHaveClass('bg-city-success');
    expect(screen.getByTestId('success-solid')).toHaveClass(
      'bg-city-success',
      'text-city-success-foreground',
    );
    expect(screen.getByRole('img', { name: 'Healthy' })).toBe(screen.getByTestId('success-dot'));
  });

  it('adds one vertical spacing step to label and count Badge sizes without resizing dots', () => {
    render(
      <>
        <Badge appearance="solid" data-testid="label-sm" size="sm">
          Small
        </Badge>
        <Badge appearance="subtle" data-testid="label-md" size="md">
          Medium
        </Badge>
        <Badge appearance="outline" data-testid="label-lg" size="lg">
          Large
        </Badge>
        <Badge aria-hidden="true" count={1} data-testid="count-sm" size="sm" />
        <Badge aria-hidden="true" count={2} data-testid="count-md" size="md" />
        <Badge aria-hidden="true" count={3} data-testid="count-lg" size="lg" />
        <Badge data-testid="dot-lg" dot size="lg" />
      </>,
    );

    expect(screen.getByTestId('label-sm')).toHaveClass('h-5', 'text-2xs');
    expect(screen.getByTestId('label-md')).toHaveClass('h-6', 'text-2xs');
    expect(screen.getByTestId('label-lg')).toHaveClass('h-7', 'text-xs');
    expect(screen.getByTestId('count-sm')).toHaveClass('h-5', 'min-w-5', 'text-2xs');
    expect(screen.getByTestId('count-md')).toHaveClass('h-6', 'min-w-6', 'text-2xs');
    expect(screen.getByTestId('count-lg')).toHaveClass('h-7', 'min-w-7', 'text-xs');
    expect(screen.getByTestId('dot-lg')).toHaveClass('size-2.5');
    expect(screen.getByTestId('dot-lg')).not.toHaveClass('h-7');
  });
});
