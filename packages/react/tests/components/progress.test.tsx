import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from '../../src/components/progress';

describe('Progress', () => {
  it('uses the Base UI progress contract while clamping determinate values', () => {
    render(
      <Progress.Root aria-label="Build progress" max={100} value={150}>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>,
    );

    const progress = screen.getByRole('progressbar', { name: 'Build progress' });

    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
    expect(progress).toHaveAttribute('aria-valuenow', '100');
    expect(progress).toHaveAttribute('data-complete');
    expect(progress.querySelector('[data-complete]')).toBeInTheDocument();
  });

  it('exposes invalid maximum fallback on linear and circular progress', () => {
    const { container } = render(
      <>
        <Progress.Root aria-label="Linear progress" max={0} value={-2}>
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
        <Progress.Circular aria-label="Circular progress" max={Number.NaN} value={25} />
      </>,
    );

    expect(screen.getByRole('progressbar', { name: 'Linear progress' })).toHaveAttribute(
      'data-invalid-max',
    );
    expect(screen.getByRole('progressbar', { name: 'Linear progress' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
    expect(screen.getByRole('progressbar', { name: 'Circular progress' })).toHaveAttribute(
      'data-invalid-max',
    );
    expect(container.querySelector('svg')).toHaveAttribute('data-city-progress-circular');
  });
});
