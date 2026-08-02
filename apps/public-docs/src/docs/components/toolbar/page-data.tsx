import toolbarSource from './examples/toolbar.tsx?raw';
import ToolbarExample from './examples/toolbar';
import type { ComponentPageData } from '../../types';
export const pageData = {
  api: [
    {
      name: 'appearance',
      type: "'plain' | 'band' | 'outline'",
      defaultValue: "'outline'",
      description: '도구 모음 표면입니다.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: '항목 크기입니다.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description: '도구 모음 방향입니다.',
    },
    { name: 'Toolbar.Group', type: 'component', description: '관련 도구를 묶습니다.' },
    {
      name: 'Toolbar.Button / Toolbar.Toggle variant',
      type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'",
      description: '명령과 토글의 시각적 위계를 정합니다.',
    },
    {
      name: 'Toolbar.Link variant',
      type: "'secondary' | 'outline' | 'ghost'",
      description: 'render로 합성한 내부 링크의 표면을 정합니다.',
    },
  ],
  examples: [
    {
      Component: ToolbarExample,
      coverage: [
        { axis: 'appearance', values: ['plain', 'band', 'outline'] },
        { axis: 'size', values: ['sm', 'md', 'lg'] },
        { axis: 'orientation', values: ['horizontal', 'vertical'] },
        {
          axis: 'buttonVariant',
          values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
        },
        { axis: 'linkVariant', values: ['secondary', 'outline', 'ghost'] },
        {
          axis: 'toggleVariant',
          values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
        },
      ],
      description: '모든 표면·크기·방향에 명령, 구분선, 토글 그룹을 배치합니다.',
      id: 'toolbar-basic',
      source: toolbarSource,
      title: '편집 도구',
    },
  ],
  optionAxes: [
    { name: 'appearance', defaultValue: 'outline', values: ['plain', 'band', 'outline'] },
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg'] },
    { name: 'orientation', defaultValue: 'horizontal', values: ['horizontal', 'vertical'] },
    {
      name: 'buttonVariant',
      defaultValue: 'ghost',
      values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
    {
      name: 'linkVariant',
      defaultValue: 'ghost',
      values: ['secondary', 'outline', 'ghost'],
    },
    {
      name: 'toggleVariant',
      defaultValue: 'ghost',
      values: ['primary', 'secondary', 'outline', 'ghost', 'destructive'],
    },
  ],
} satisfies ComponentPageData;
