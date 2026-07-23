import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUpload } from '@city-ds/react';

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
  title: 'Forms/File upload',
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
};

export const Disabled: Story = {
  args: {
    disabled: true,
    multiple: true,
    withFiles: true,
  },
};
