import type { Meta, StoryObj } from '@storybook/react-vite';
import { X } from 'lucide-react';
import { Button, Drawer, type DrawerSide } from '@city-ds/react';

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Drawer는 현재 화면의 맥락을 유지하면서 탐색이나 보조 작업을 보여주는 표면입니다. `Viewport`와 `Popup`의 `side`를 맞추고, `Root`의 `swipeDirection`에는 닫히는 방향을 지정합니다. 접근 가능한 이름을 위해 `Title`을 포함하세요.',
      },
    },
  },
} satisfies Meta<typeof Drawer.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function DrawerExample({ side = 'right', modal = true }: { side?: DrawerSide; modal?: boolean }) {
  return (
    <Drawer.Root modal={modal} swipeDirection={side === 'bottom' ? 'down' : side}>
      <Drawer.Trigger render={<Button />}>
        {side === 'bottom' ? 'Open tasks' : 'Open navigation'}
      </Drawer.Trigger>
      <Drawer.Portal>
        {modal ? <Drawer.Backdrop /> : null}
        <Drawer.Viewport side={side}>
          <Drawer.Popup side={side}>
            <Drawer.Content>
              <div className="flex items-start gap-3">
                <Drawer.Title className="min-w-0 flex-1">
                  {side === 'bottom' ? 'Task queue' : 'Mobile navigation'}
                </Drawer.Title>
                {side === 'bottom' ? null : (
                  <Drawer.Close
                    aria-label="Close drawer"
                    render={
                      <Button
                        className="text-city-muted-foreground hover:text-city-accent-foreground -mt-1 -mr-1 size-8 p-0"
                        variant="ghost"
                      />
                    }
                  >
                    <X aria-hidden="true" size={18} strokeWidth={1.8} />
                  </Drawer.Close>
                )}
              </div>
              <Drawer.Description>
                Use drawers for focused navigation and secondary workflows on compact screens.
              </Drawer.Description>
              <nav aria-label="Workspace" className="mt-5 grid gap-2 text-sm">
                {['Overview', 'Projects', 'Deployments', 'Settings'].map((item) => (
                  <a key={item} className="rounded-city-sm hover:bg-city-accent px-3 py-2" href="#">
                    {item}
                  </a>
                ))}
              </nav>
              {side === 'bottom' ? (
                <div className="mt-6 flex justify-end gap-2">
                  <Drawer.Close render={<Button variant="secondary" />}>Close</Drawer.Close>
                </div>
              ) : null}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export const MobileNavigation: Story = {
  parameters: {
    docs: {
      description: {
        story: '왼쪽 Drawer는 작은 화면의 주요 탐색에 사용합니다.',
      },
    },
  },
  render: () => <DrawerExample side="left" />,
};

export const NonModalTaskPanel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '비모달 보조 패널은 `modal={false}`로 설정하고 배경을 가리지 않도록 Backdrop을 생략합니다.',
      },
    },
  },
  render: () => <DrawerExample side="right" modal={false} />,
};

export const BottomSheet: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Bottom Sheet는 작은 화면에서 짧은 선택이나 보조 작업을 보여주는 하단 Drawer입니다.',
      },
    },
  },
  render: () => (
    <Drawer.Root swipeDirection="down">
      <Drawer.Trigger render={<Button />}>Choose export format</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport side="bottom">
          <Drawer.Popup side="bottom">
            <div
              aria-hidden
              className="flex h-8 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
            >
              <div className="bg-city-border h-1 w-10 rounded-full" />
            </div>
            <Drawer.Content className="pt-1">
              <Drawer.Title>Export format</Drawer.Title>
              <Drawer.Description>Choose a format for the current dataset.</Drawer.Description>
              <div className="mt-5 grid gap-2">
                {['CSV', 'GeoJSON', 'Shapefile'].map((format) => (
                  <Drawer.Close
                    key={format}
                    className="w-full justify-start"
                    render={<Button variant="outline" />}
                  >
                    {format}
                  </Drawer.Close>
                ))}
              </div>
              <Drawer.Close className="mt-3 w-full" render={<Button variant="ghost" />}>
                Cancel
              </Drawer.Close>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  ),
};

export const LongBottomContent: Story = {
  parameters: {
    docs: {
      description: {
        story: '긴 내용은 `Content` 안에서 스크롤되며 작업 버튼은 하단에 고정할 수 있습니다.',
      },
    },
  },
  render: () => (
    <Drawer.Root swipeDirection="down">
      <Drawer.Trigger render={<Button />}>Open long content</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport side="bottom">
          <Drawer.Popup side="bottom">
            <Drawer.Content>
              <Drawer.Title>Release checklist</Drawer.Title>
              <Drawer.Description>
                Review every item before publishing the mobile build.
              </Drawer.Description>
              <ol className="mt-5 grid gap-3 text-sm">
                {Array.from({ length: 18 }, (_, index) => (
                  <li key={index} className="rounded-city-sm border-city-border border p-3">
                    Checklist item {index + 1}: confirm copy, accessibility, and QA notes.
                  </li>
                ))}
              </ol>
            </Drawer.Content>
            <div className="border-city-border bg-city-surface-raised flex shrink-0 justify-end gap-2 border-t px-5 py-4">
              <Drawer.Close render={<Button variant="secondary" />}>Dismiss</Drawer.Close>
              <Drawer.Close render={<Button />}>Publish</Drawer.Close>
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  ),
};
