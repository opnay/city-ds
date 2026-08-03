import sidesSource from './examples/sides.tsx?raw';
import SidesExample from './examples/sides';
import type { ComponentPageData } from '../../types';

export const pageData = {
  api: [
    {
      name: 'side',
      type: "'left' | 'right' | 'bottom'",
      defaultValue: "'right'",
      description: 'Viewport와 Popup에 같은 방향을 지정합니다.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
      defaultValue: "'md'",
      description: '방향별 너비 또는 최대 높이입니다.',
    },
    {
      name: 'swipeDirection',
      type: "'left' | 'right' | 'down'",
      description: 'Root에는 닫히는 방향을 지정합니다.',
    },
    {
      name: 'modal',
      type: 'boolean',
      defaultValue: 'true',
      description: '비모달 보조 패널 여부를 정합니다.',
    },
  ],
  examples: [
    {
      Component: SidesExample,
      coverage: [
        {
          axis: 'side',
          values: ['left', 'right', 'bottom'],
          combinations: [
            'side=left|size=sm',
            'side=left|size=md',
            'side=left|size=lg',
            'side=left|size=xl',
            'side=left|size=full',
            'side=right|size=sm',
            'side=right|size=md',
            'side=right|size=lg',
            'side=right|size=xl',
            'side=right|size=full',
            'side=bottom|size=sm',
            'side=bottom|size=md',
            'side=bottom|size=lg',
            'side=bottom|size=xl',
            'side=bottom|size=full',
          ],
        },
        { axis: 'size', values: ['sm', 'md', 'lg', 'xl', 'full'] },
        { axis: 'modal', values: ['true', 'false'] },
      ],
      description: '방향과 크기를 맞춘 구조를 확인합니다.',
      id: 'drawer-sides',
      source: sidesSource,
      title: 'side × size',
    },
  ],
  optionAxes: [
    { name: 'side', defaultValue: 'right', values: ['left', 'right', 'bottom'] },
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg', 'xl', 'full'] },
    { name: 'modal', defaultValue: 'true', values: ['true', 'false'] },
  ],
} satisfies ComponentPageData;
