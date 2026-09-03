import structureSource from './examples/structure.tsx?raw';
import PanelStructureExample from './examples/structure';
import { PanelPreview } from '../../preview-playgrounds/surfaces';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'panel-playground',
  widePreviewIds: ['panel-playground', 'panel-structure'],
  api: [
    {
      name: 'Panel.Root',
      type: 'div props + render',
      description: 'Header와 Body의 구조 범위를 만듭니다.',
    },
    {
      name: 'Panel.Header actions',
      type: 'ReactNode',
      description: 'Header 문맥과 분리해 끝에 정렬할 액션입니다.',
    },
    {
      name: 'Panel.Body',
      type: 'div props + render',
      description: '콘텐츠 영역을 만듭니다. 배경, padding과 overflow는 소비자가 정합니다.',
    },
  ],
  examples: [
    {
      Component: PanelPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 Header 액션 제공 여부를 조절합니다.',
      id: 'panel-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/panel', 'Panel'),
      title: 'Preview',
    },
    {
      Component: PanelStructureExample,
      coverage: [{ axis: 'actions', values: ['none', 'provided'] }],
      description: '같은 Header·Body 구조에 액션을 선택적으로 조합합니다.',
      id: 'panel-structure',
      filename: 'structure.tsx',
      source: structureSource,
      title: 'Header와 Body',
    },
  ],
  optionAxes: [{ name: 'actions', defaultValue: 'none', values: ['none', 'provided'] }],
} satisfies ComponentPageData;
