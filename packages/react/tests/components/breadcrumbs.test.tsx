import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from '../../src/components/breadcrumbs';

describe('Breadcrumbs', () => {
  it('preserves navigation, ordered list, link, current page, and separator semantics', () => {
    render(
      <Breadcrumbs.Root>
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="/">Home</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Link href="/services">Services</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Separator data-testid="separator" />
            <Breadcrumbs.Page>Permits</Breadcrumbs.Page>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>,
    );

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toHaveAttribute(
      'data-city-breadcrumbs-root',
    );
    expect(screen.getByRole('list')).toHaveAttribute('data-city-breadcrumbs-list');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass(
      'opacity-[0.64]',
      'hover:opacity-[0.84]',
      'focus-visible:opacity-[0.84]',
      'active:opacity-[0.84]',
    );
    expect(screen.getByText('Permits')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Permits')).toHaveClass('font-medium', 'opacity-100');
    expect(screen.getByTestId('separator')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('separator')).toHaveClass('opacity-[0.64]');
  });

  it('supports manually labeled ellipsis and custom render composition', () => {
    render(
      <Breadcrumbs.Root>
        <Breadcrumbs.List>
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="/" render={<a data-router-link="next" />}>
              Home
            </Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Ellipsis aria-label="Collapsed city pages" />
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Page>Inspections</Breadcrumbs.Page>
          </Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>,
    );

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('data-router-link', 'next');
    const ellipsisLabel = screen.getByText('Collapsed city pages');

    expect(ellipsisLabel).toHaveClass('sr-only');
    expect(ellipsisLabel.parentElement).toHaveAttribute('data-city-breadcrumbs-ellipsis');
    expect(ellipsisLabel.parentElement).toHaveClass('opacity-[0.64]');
    expect(ellipsisLabel.previousElementSibling).toHaveAttribute('aria-hidden', 'true');
  });
});
