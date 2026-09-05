import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from '../../src/components/alert';
import { Breadcrumbs } from '../../src/components/breadcrumbs';
import { EmptyState } from '../../src/components/empty-state';
import { FileUpload } from '../../src/components/file-upload';
import { Pagination } from '../../src/components/pagination';
import { Progress } from '../../src/components/progress';
import { Skeleton } from '../../src/components/skeleton';
import { Table } from '../../src/components/table';

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

describe('Table', () => {
  it.each(['xsm', 'sm', 'md', 'lg', 'xlg'] as const)(
    'keeps a 16px region gutter at the %s table edges',
    (size) => {
      render(
        <Table.Root aria-label={`${size} table`} size={size}>
          <Table.Header>
            <Table.Row>
              <Table.Head>First heading</Table.Head>
              <Table.Head>Last heading</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>First value</Table.Cell>
              <Table.Cell>Last value</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>,
      );

      for (const cell of [
        screen.getByRole('columnheader', { name: 'First heading' }),
        screen.getByRole('columnheader', { name: 'Last heading' }),
        screen.getByRole('cell', { name: 'First value' }),
        screen.getByRole('cell', { name: 'Last value' }),
      ]) {
        expect(cell).toHaveClass('first:ps-4', 'last:pe-4');
      }
    },
  );

  it('keeps native table semantics and applies size and variant state', () => {
    render(
      <Table.Root size="sm" variant="surface">
        <Table.Caption>Recent jobs</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Job</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Build</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>1 job</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>,
    );

    const table = screen.getByRole('table', { name: 'Recent jobs' });

    expect(table).toHaveAttribute('data-size', 'sm');
    expect(table).toHaveAttribute('data-variant', 'surface');
    expect(screen.getByRole('columnheader', { name: 'Job' })).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('cell', { name: 'Build' })).toBeInTheDocument();
  });

  it('supports controlled sorting and keyboard activation', async () => {
    const user = userEvent.setup();
    const onDirectionChange = vi.fn();

    render(
      <Table.Root aria-label="Projects">
        <Table.Header>
          <Table.Row>
            <Table.Head aria-sort="ascending">
              <Table.SortButton direction="asc" onDirectionChange={onDirectionChange}>
                Project
              </Table.SortButton>
            </Table.Head>
          </Table.Row>
        </Table.Header>
      </Table.Root>,
    );

    const button = screen.getByRole('button', { name: 'Project (sorted ascending)' });

    expect(screen.getByRole('columnheader', { name: /Project/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );

    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(onDirectionChange).toHaveBeenCalledWith('desc');
  });

  it('supports selectable header, row cells, and indeterminate state', async () => {
    const user = userEvent.setup();
    const onAllChange = vi.fn();
    const onRowChange = vi.fn();

    render(
      <Table.Root aria-label="Projects">
        <Table.Header>
          <Table.Row>
            <Table.SelectionHead checked="indeterminate" onCheckedChange={onAllChange} />
            <Table.Head>Project</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.SelectionCell label="Select Beacon" onCheckedChange={onRowChange} />
            <Table.Cell>Beacon</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toHaveAttribute(
      'aria-checked',
      'mixed',
    );

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    await user.click(screen.getByRole('checkbox', { name: 'Select Beacon' }));

    expect(onAllChange).toHaveBeenCalledWith(true);
    expect(onRowChange).toHaveBeenCalledWith(true);
  });

  it('renders empty and loading state rows across all columns', () => {
    render(
      <Table.Root aria-label="Projects">
        <Table.Body>
          <Table.StateRow colSpan={3}>No projects</Table.StateRow>
          <Table.StateRow colSpan={3} status="loading">
            Loading projects
          </Table.StateRow>
        </Table.Body>
      </Table.Root>,
    );

    expect(screen.getByRole('cell', { name: 'No projects' })).toHaveAttribute('colspan', '3');
    expect(screen.getByRole('status')).toHaveAttribute('data-city-table-state', 'loading');
  });
});

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

describe('FileUpload', () => {
  it('propagates compact density through its trigger, list, item, and remove control', () => {
    const file = new File(['content'], 'report.txt', {
      lastModified: 1,
      type: 'text/plain',
    });

    render(
      <FileUpload.Root defaultFiles={[file]} density="compact">
        <FileUpload.Trigger />
        <FileUpload.List />
      </FileUpload.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'Choose files' });
    const root = trigger.closest('[data-city-file-upload-root]');
    const remove = screen.getByRole('button', { name: 'Remove report.txt' });

    expect(root).toHaveAttribute('data-city-density', 'compact');
    expect(root).toHaveClass('gap-2');
    expect(trigger).toHaveAttribute('data-city-density', 'compact');
    expect(trigger).toHaveClass('h-(--city-control-sm)', 'text-xs');
    expect(screen.getByText('report.txt').parentElement).toHaveClass('py-1', 'text-xs');
    expect(remove).toHaveClass('h-5', 'text-xs');
  });

  it('keeps native input metadata, displays each selected file once, and removes files locally', async () => {
    const user = userEvent.setup();
    const onFilesChange = vi.fn();
    const file = new File(['content'], 'report.txt', { lastModified: 1, type: 'text/plain' });
    const { container } = render(
      <FileUpload.Root accept="text/plain" multiple name="reports" onFilesChange={onFilesChange}>
        <FileUpload.Trigger>Choose report</FileUpload.Trigger>
        <FileUpload.List />
      </FileUpload.Root>,
    );
    const input = container.querySelector('input[type="file"]');
    const root = screen
      .getByRole('button', { name: 'Choose report' })
      .closest('[data-city-file-upload-root]');

    expect(input).toHaveAttribute('accept', 'text/plain');
    expect(input).toHaveAttribute('name', 'reports');
    expect(input).toHaveAttribute('multiple');
    expect(input).toHaveAccessibleName('File upload');
    expect(root).toHaveClass('gap-3');

    await user.upload(input as HTMLInputElement, file);
    await user.upload(input as HTMLInputElement, file);

    expect(screen.getAllByText('report.txt')).toHaveLength(1);
    expect(onFilesChange).toHaveBeenLastCalledWith([file]);

    await user.click(screen.getByRole('button', { name: 'Remove report.txt' }));

    expect(screen.queryByText('report.txt')).not.toBeInTheDocument();
    expect(onFilesChange).toHaveBeenLastCalledWith([]);
  });

  it('localizes default labels and preserves direct accessible-name overrides', () => {
    const file = new File(['content'], '도면.pdf', {
      lastModified: 1,
      type: 'application/pdf',
    });
    const { container } = render(
      <>
        <span id="attachment-label">첨부 파일</span>
        <FileUpload.Root
          aria-labelledby="attachment-label"
          defaultFiles={[file]}
          labels={{
            input: '파일 업로드',
            trigger: (multiple) => (multiple ? '파일들 선택' : '파일 선택'),
            remove: (selectedFile) => (selectedFile ? `${selectedFile.name} 제거` : '파일 제거'),
          }}
        >
          <FileUpload.Trigger />
          <FileUpload.List>
            {(selectedFile, index) => (
              <FileUpload.Item file={selectedFile} index={index}>
                <span>{selectedFile.name}</span>
                <FileUpload.Remove aria-label="직접 지정한 제거" index={index} />
              </FileUpload.Item>
            )}
          </FileUpload.List>
        </FileUpload.Root>
      </>,
    );

    expect(container.querySelector('input[type="file"]')).toHaveAccessibleName('첨부 파일');
    expect(screen.getByRole('button', { name: '파일 선택' })).toBeVisible();
    expect(screen.getByRole('button', { name: '직접 지정한 제거' })).toBeVisible();
  });
});

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

describe('EmptyState', () => {
  it('connects title and description to the root region and honors heading level', () => {
    render(
      <EmptyState.Root density="compact">
        <EmptyState.Title level={3}>No invoices</EmptyState.Title>
        <EmptyState.Description>Create an invoice to get started.</EmptyState.Description>
      </EmptyState.Root>,
    );

    const region = screen.getByRole('region', {
      name: 'No invoices',
      description: 'Create an invoice to get started.',
    });

    expect(region).toHaveAttribute('data-density', 'compact');
    expect(region).toHaveClass('gap-3', 'p-3');
    expect(region).toHaveAccessibleDescription('Create an invoice to get started.');
    expect(screen.getByRole('heading', { level: 3, name: 'No invoices' })).toBeInTheDocument();
  });

  it('keeps action controls keyboard accessible', async () => {
    const user = userEvent.setup();
    const onPrimary = vi.fn();
    const onSecondary = vi.fn();

    render(
      <EmptyState.Root>
        <EmptyState.Title>No reports</EmptyState.Title>
        <EmptyState.Description>
          Generate a report or learn how reports work.
        </EmptyState.Description>
        <EmptyState.Actions>
          <button onClick={onPrimary}>Generate report</button>
          <button onClick={onSecondary}>Read guide</button>
        </EmptyState.Actions>
      </EmptyState.Root>,
    );

    const region = screen.getByRole('region', { name: 'No reports' });
    const actions = screen.getByRole('button', { name: 'Generate report' }).parentElement;

    expect(region).toHaveClass('gap-4', 'p-6');
    expect(actions).toHaveClass('gap-3');
    expect(actions).not.toHaveClass('pt-1');

    await user.tab();
    expect(screen.getByRole('button', { name: 'Generate report' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onPrimary).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Read guide' })).toHaveFocus();
    await user.keyboard(' ');
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });
});

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
