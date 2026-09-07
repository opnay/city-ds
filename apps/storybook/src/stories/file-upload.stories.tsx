import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { FileUpload } from '@opnay/city-ds-react';

interface FileUploadStoryArgs {
  accept?: string;
  disabled: boolean;
  multiple: boolean;
  withFiles: boolean;
}

function createExampleFiles(): File[] {
  return [
    new File(['city-ds'], 'city-ds-spec.txt', {
      type: 'text/plain',
      lastModified: 1_721_620_800_000,
    }),
    new File(['# component map'], 'components.md', {
      type: 'text/markdown',
      lastModified: 1_721_620_800_000,
    }),
  ];
}

function FileUploadExample({ accept, disabled, multiple, withFiles }: FileUploadStoryArgs) {
  const [files, setFiles] = React.useState<File[]>(() => (withFiles ? createExampleFiles() : []));

  return (
    <div style={{ minWidth: 320, maxWidth: 480 }}>
      <FileUpload.Root
        {...(accept === undefined ? {} : { accept })}
        aria-label="Project files"
        disabled={disabled}
        files={files}
        multiple={multiple}
        onFilesChange={setFiles}
      >
        <FileUpload.Trigger>{multiple ? 'Choose files' : 'Choose a file'}</FileUpload.Trigger>
        <FileUpload.List aria-label="Selected files" />
      </FileUpload.Root>
    </div>
  );
}

const meta = {
  title: 'Inputs/File upload',
  component: FileUploadExample,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '파일 선택과 목록 제거만 담당하는 제어·비제어형 파일 업로드 컴포넌트입니다. 네트워크 업로드는 소비자 코드에서 처리합니다.',
      },
    },
  },
  argTypes: {
    accept: { control: 'text' },
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
    withFiles: { control: 'boolean' },
  },
  render: (args) => <FileUploadExample key={String(args.withFiles)} {...args} />,
} satisfies Meta<FileUploadStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
    multiple: false,
    withFiles: false,
  },
};

export const Compact: Story = {
  args: {
    disabled: false,
    multiple: true,
    withFiles: true,
  },
  render: () => (
    <div style={{ minWidth: 320, maxWidth: 480 }}>
      <FileUpload.Root
        aria-label="Compact project files"
        defaultFiles={createExampleFiles()}
        density="compact"
        multiple
      >
        <FileUpload.Trigger>Choose files</FileUpload.Trigger>
        <FileUpload.List aria-label="Selected compact files" />
      </FileUpload.Root>
    </div>
  ),
};

export const Multiple: Story = {
  args: {
    accept: '.md,.txt',
    disabled: false,
    multiple: true,
    withFiles: false,
  },
};

export const WithFiles: Story = {
  args: {
    disabled: false,
    multiple: true,
    withFiles: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('city-ds-spec.txt')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Remove city-ds-spec.txt' }));

    await expect(canvas.queryByText('city-ds-spec.txt')).toBeNull();
    await expect(canvas.getByText('components.md')).toBeVisible();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    multiple: true,
    withFiles: true,
  },
};

export const KoreanLabels: Story = {
  args: {
    disabled: false,
    multiple: false,
    withFiles: true,
  },
  render: () => (
    <div style={{ minWidth: 320, maxWidth: 480 }}>
      <FileUpload.Root
        aria-label="프로젝트 첨부 파일"
        defaultFiles={createExampleFiles()}
        labels={{
          input: '파일 업로드',
          trigger: (multiple) => (multiple ? '파일들 선택' : '파일 선택'),
          remove: (file) => (file ? `${file.name} 제거` : '파일 제거'),
        }}
      >
        <FileUpload.Trigger />
        <FileUpload.List aria-label="선택된 파일" />
      </FileUpload.Root>
    </div>
  ),
};
