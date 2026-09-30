import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload } from '../../src/components/file-upload';

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
