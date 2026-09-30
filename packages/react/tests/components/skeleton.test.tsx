import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from '../../src/components/skeleton';

describe('Skeleton', () => {
  it('stays decorative while exposing visual variant and size state', () => {
    const { container } = render(
      <Skeleton aria-label="Loading title" role="status" size="lg" variant="rectangular" />,
    );

    const skeleton = container.querySelector('.city-skeleton');

    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).not.toHaveAttribute('aria-label');
    expect(skeleton).not.toHaveAttribute('role');
    expect(skeleton).toHaveAttribute('data-size', 'lg');
    expect(skeleton).toHaveAttribute('data-variant', 'rectangular');
    expect(screen.queryByLabelText('Loading title')).not.toBeInTheDocument();
  });

  it('uses typography metrics instead of a fixed height for text variants', () => {
    const { container } = render(<Skeleton size="sm" />);

    const skeleton = container.querySelector('.city-skeleton');

    expect(skeleton).toHaveClass('text-sm', 'w-24');
    expect(skeleton).not.toHaveClass('h-3');
  });
});
