import modalitySource from './examples/modality.tsx?raw';
import DrawerModalityExample from './examples/modality';
import sidesSource from './examples/sides.tsx?raw';
import SidesExample from './examples/sides';
import { DrawerPreview } from '../../preview-playgrounds/surfaces';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'drawer-playground',
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
      Component: DrawerPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 방향, 크기와 모달 동작을 조절합니다.',
      id: 'drawer-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/drawer', 'Drawer'),
      title: 'Preview',
    },
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
      ],
      description: '방향과 크기를 맞춘 구조를 확인합니다.',
      id: 'drawer-sides',
      filename: 'sides.tsx',
      source: sidesSource,
      title: 'side × size',
    },
    {
      Component: DrawerModalityExample,
      coverage: [{ axis: 'modal', values: ['true', 'false'] }],
      description: '배경 상호작용을 막는 작업과 계속 허용하는 보조 패널을 구분합니다.',
      id: 'drawer-modality',
      filename: 'modality.tsx',
      source: modalitySource,
      title: '모달 동작',
    },
  ],
  optionAxes: [
    {
      control: 'segmented',
      name: 'side',
      defaultValue: 'right',
      values: ['left', 'right', 'bottom'],
    },
    {
      control: 'segmented',
      name: 'size',
      defaultValue: 'md',
      values: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    { name: 'modal', defaultValue: 'true', values: ['true', 'false'] },
  ],
} satisfies ComponentPageData;
