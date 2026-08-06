import confirmSource from './examples/confirm.tsx?raw';
import ConfirmExample from './examples/confirm';
import type { ComponentPageData } from '../../types';

export const pageData = {
  featuredExampleId: 'alert-dialog-confirm',
  api: [
    {
      name: 'open / defaultOpen',
      type: 'boolean',
      description: '열림 상태를 제어하거나 초기화합니다.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: '열림 상태 변경을 받습니다.',
    },
    {
      name: 'AlertDialog.Action',
      type: 'Close props & { destructive?: boolean }',
      description: '확인과 닫힘을 하나의 명시적 행동으로 제공합니다.',
    },
    {
      name: 'render',
      type: 'ReactElement | render function',
      description: 'Trigger, Cancel, Action에 Button을 합성합니다.',
    },
  ],
  examples: [
    {
      Component: ConfirmExample,
      coverage: [
        { axis: 'open', values: ['false', 'true'] },
        { axis: 'controlled', values: ['true'] },
        { axis: 'destructive', values: ['true'] },
      ],
      description: '제어된 파괴적 확인과 취소 복귀를 보여 줍니다.',
      id: 'alert-dialog-confirm',
      filename: 'confirm.tsx',
      source: confirmSource,
      title: '복구할 수 없는 작업 확인',
    },
  ],
  optionAxes: [
    { name: 'open', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'destructive', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
