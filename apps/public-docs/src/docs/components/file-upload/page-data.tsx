import densitySource from './examples/density.tsx?raw';
import FileUploadDensityExample from './examples/density';
import disabledSource from './examples/disabled.tsx?raw';
import FileUploadDisabledExample from './examples/disabled';
import selectionSource from './examples/selection.tsx?raw';
import FileUploadSelectionExample from './examples/selection';
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
      Component: FileUploadSelectionExample,
      coverage: [
        { axis: 'multiple', values: ['false', 'true'] },
        { axis: 'controlled', values: ['true'] },
        { axis: 'empty', values: ['true', 'false'] },
      ],
      description: '단일·복수 파일 선택과 목록을 로컬 상태로만 관리합니다.',
      id: 'file-upload-selection',
      filename: 'selection.tsx',
      source: selectionSource,
      title: '로컬 파일 선택',
    },
    {
      Component: FileUploadDensityExample,
      coverage: [{ axis: 'density', values: ['comfortable', 'compact'] }],
      description: '주변 폼 밀도에 맞춰 트리거와 파일 목록 간격을 선택합니다.',
      id: 'file-upload-density',
      filename: 'density.tsx',
      source: densitySource,
      title: '밀도',
    },
    {
      Component: FileUploadDisabledExample,
      coverage: [{ axis: 'disabled', values: ['true'] }],
      description: '파일을 변경할 수 없는 이유를 주변 문맥과 함께 제공합니다.',
      id: 'file-upload-disabled',
      filename: 'disabled.tsx',
      source: disabledSource,
      title: '비활성 상태',
    },
  ],
  optionAxes: [
    { name: 'multiple', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'density', values: ['comfortable', 'compact'] },
  ],
} satisfies ComponentPageData;
