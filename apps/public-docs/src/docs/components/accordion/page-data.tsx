import selectionSource from './examples/selection.tsx?raw';
import AccordionSelectionExample from './examples/selection';
import statesSource from './examples/states.tsx?raw';
import AccordionStatesExample from './examples/states';
import { AccordionPreview } from '../../preview-playgrounds/forms';
import { createPlaygroundSource } from '../../preview-playgrounds/source';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'accordion-playground',
  api: [
    {
      name: 'multiple',
      type: 'boolean',
      defaultValue: 'false',
      description: '여러 항목을 동시에 열 수 있게 합니다.',
    },
    {
      name: 'value / defaultValue',
      type: 'string[]',
      description: '열린 항목을 제어하거나 초기화합니다.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      defaultValue: 'false',
      description: 'Root 전체 또는 Item 단위로 열림을 막습니다.',
    },
  ],
  examples: [
    {
      Component: AccordionPreview,
      configurable: true,
      coverage: [{ axis: 'preview', values: ['configurable'] }],
      description: '사이드바에서 여러 항목 열기와 비활성 상태를 조절합니다.',
      id: 'accordion-playground',
      filename: 'playground.tsx',
      source: createPlaygroundSource('@opnay/city-ds-react/accordion', 'Accordion'),
      title: 'Preview',
    },
    {
      Component: AccordionSelectionExample,
      coverage: [{ axis: 'multiple', values: ['false', 'true'] }],
      description: '한 항목 또는 여러 항목을 열 수 있는 구조를 비교합니다.',
      id: 'accordion-selection',
      filename: 'selection.tsx',
      source: selectionSource,
      title: '열림 방식',
    },
    {
      Component: AccordionStatesExample,
      coverage: [
        { axis: 'disabled', values: ['true'] },
        { axis: 'mode', values: ['uncontrolled', 'controlled'] },
      ],
      description: '외부에서 열린 항목을 제어하고 전체 상호작용을 막습니다.',
      id: 'accordion-states',
      filename: 'states.tsx',
      source: statesSource,
      title: '상태 제어',
    },
  ],
  optionAxes: [
    { name: 'multiple', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'mode', defaultValue: 'uncontrolled', values: ['uncontrolled', 'controlled'] },
  ],
} satisfies ComponentPageData;
