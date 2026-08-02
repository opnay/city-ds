import localFilesSource from './examples/local-files.tsx?raw';
import LocalFilesExample from './examples/local-files';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      name: 'files / defaultFiles',
      type: 'File[]',
      description: '선택 목록을 제어하거나 초기화합니다.',
    },
    {
      name: 'onFilesChange',
      type: '(files: File[]) => void',
      description: '추가·제거된 로컬 File 목록을 받습니다.',
    },
    {
      name: 'multiple',
      type: 'boolean',
      defaultValue: 'false',
      description: '여러 파일 선택을 허용합니다.',
    },
    { name: 'accept', type: 'string', description: '파일 선택기의 허용 형식을 힌트로 제공합니다.' },
  ],
  examples: [
    {
      Component: LocalFilesExample,
      coverage: [
        { axis: 'multiple', values: ['false', 'true'] },
        { axis: 'controlled', values: ['true'] },
        { axis: 'empty', values: ['true', 'false'] },
        { axis: 'disabled', values: ['true'] },
        { axis: 'density', values: ['comfortable', 'compact'] },
      ],
      description: '선택과 제거를 로컬 상태로만 처리합니다.',
      id: 'file-upload-local-files',
      source: localFilesSource,
      title: '로컬 파일 선택',
    },
  ],
  optionAxes: [
    { name: 'multiple', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'density', values: ['comfortable', 'compact'] },
  ],
} satisfies ComponentPageData;
