import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '../../src/components/pagination';

describe('Pagination', () => {
  it('propagates compact density to generated controls', () => {
    render(<Pagination.Root density="compact" onPageChange={vi.fn()} page={2} totalPages={4} />);

    const navigation = screen.getByRole('navigation', { name: 'Pagination' });
    const currentPage = screen.getByRole('button', { name: 'Page 2' });

    expect(navigation).toHaveAttribute('data-city-density', 'compact');
    expect(navigation.querySelector('[data-city-pagination-list]')).toHaveClass('gap-0.5');
    expect(currentPage).toHaveAttribute('data-city-density', 'compact');
    expect(currentPage).toHaveClass('size-7', 'text-xs');
  });

  it('clamps invalid controlled values and uses 1-based page changes', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination.Root onPageChange={onPageChange} page={99} totalPages={3} />);

    const navigation = screen.getByRole('navigation', { name: 'Pagination' });

    expect(navigation).toHaveAttribute('data-invalid-page');
    expect(navigation).toHaveClass('max-w-full');
    expect(navigation).toHaveClass('overflow-x-auto');
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Go to previous page' }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('provides first, previous, range, group, next, and last controls', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(<Pagination.Root groupSize={5} onPageChange={onPageChange} page={7} totalPages={20} />);

    expect(screen.getByRole('button', { name: 'Go to first page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 7' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Go to first page' })).toHaveClass(
      'hidden',
      'sm:inline-flex',
    );
    expect(screen.getByRole('button', { name: 'Go back 5 pages' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go forward 5 pages' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to last page' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go forward 5 pages' }));

    expect(screen.getByRole('button', { name: 'Go to last page' })).toHaveClass(
      'hidden',
      'sm:inline-flex',
    );
    expect(onPageChange).toHaveBeenCalledWith(12);
  });

  it('localizes generated labels while preserving direct control overrides', () => {
    render(
      <Pagination.Root
        labels={{
          navigation: '작업 페이지',
          first: '첫 페이지로',
          previous: '이전 페이지로',
          previousGroup: (count) => `${count}페이지 뒤로`,
          page: (page) => `${page}페이지`,
          nextGroup: (count) => `${count}페이지 앞으로`,
          next: '다음 페이지로',
          last: '마지막 페이지로',
        }}
        onPageChange={vi.fn()}
        page={7}
        totalPages={20}
      >
        <Pagination.List>
          <Pagination.Item>
            <Pagination.First />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Previous />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.PreviousGroup />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Page aria-label="현재 7페이지" page={7} />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.NextGroup />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Next aria-label="직접 지정한 다음" />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Last />
          </Pagination.Item>
        </Pagination.List>
      </Pagination.Root>,
    );

    expect(screen.getByRole('navigation', { name: '작업 페이지' })).toBeVisible();
    expect(screen.getByRole('button', { name: '첫 페이지로' })).toBeVisible();
    expect(screen.getByRole('button', { name: '이전 페이지로' })).toBeVisible();
    expect(screen.getByRole('button', { name: '5페이지 뒤로' })).toBeVisible();
    expect(screen.getByRole('button', { name: '현재 7페이지' })).toBeVisible();
    expect(screen.getByRole('button', { name: '5페이지 앞으로' })).toBeVisible();
    expect(screen.getByRole('button', { name: '직접 지정한 다음' })).toBeVisible();
    expect(screen.getByRole('button', { name: '마지막 페이지로' })).toBeVisible();
  });
});
