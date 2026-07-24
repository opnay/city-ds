import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from '../../src/components/empty-state';
import { FileUpload } from '../../src/components/file-upload';
import { Pagination } from '../../src/components/pagination';
import { Progress } from '../../src/components/progress';
import { Table } from '../../src/components/table';

describe('Table', () => {
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
});

describe('Pagination', () => {
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

    expect(input).toHaveAttribute('accept', 'text/plain');
    expect(input).toHaveAttribute('name', 'reports');
    expect(input).toHaveAttribute('multiple');
    expect(input).toHaveAccessibleName('File upload');

    await user.upload(input as HTMLInputElement, file);
    await user.upload(input as HTMLInputElement, file);

    expect(screen.getAllByText('report.txt')).toHaveLength(1);
    expect(onFilesChange).toHaveBeenLastCalledWith([file]);

    await user.click(screen.getByRole('button', { name: 'Remove report.txt' }));

    expect(screen.queryByText('report.txt')).not.toBeInTheDocument();
    expect(onFilesChange).toHaveBeenLastCalledWith([]);
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
