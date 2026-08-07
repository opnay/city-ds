import controlledSource from './examples/controlled.tsx?raw';
import ControlledExample from './examples/controlled';
import scrollSource from './examples/scroll.tsx?raw';
import DialogScrollExample from './examples/scroll';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'dialog-controlled',
  api: [
    {
      name: 'open / defaultOpen',
      type: 'boolean',
      description: '열림 상태를 제어하거나 초기화합니다.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
      defaultValue: "'md'",
      description: 'Popup 최대 너비를 정합니다.',
    },
    {
      name: 'scroll',
      type: "'none' | 'body'",
      defaultValue: "'none'",
      description: '본문 스크롤 구조를 선택합니다.',
    },
    {
      name: 'Header / Body / Footer',
      type: 'Dialog sections',
      description: 'scroll="body"에서 고정된 구조를 제공합니다.',
    },
  ],
  examples: [
    {
      Component: ControlledExample,
      coverage: [
        { axis: 'open', values: ['false', 'true'] },
        { axis: 'size', values: ['sm', 'md', 'lg', 'xl', 'full'] },
      ],
      description: '제어된 열림과 각 Popup 최대 너비를 보여 줍니다.',
      id: 'dialog-controlled',
      filename: 'controlled.tsx',
      source: controlledSource,
      title: '편집·정보 Dialog',
    },
    {
      Component: DialogScrollExample,
      coverage: [{ axis: 'scroll', values: ['none', 'body'] }],
      description: '내용 길이에 맞춰 전체 또는 본문 스크롤 구조를 선택합니다.',
      id: 'dialog-scroll',
      filename: 'scroll.tsx',
      source: scrollSource,
      title: '스크롤 구조',
    },
  ],
  optionAxes: [
    { name: 'size', defaultValue: 'md', values: ['sm', 'md', 'lg', 'xl', 'full'] },
    { name: 'scroll', defaultValue: 'none', values: ['none', 'body'] },
  ],
} satisfies ComponentPageData;
