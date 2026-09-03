import { useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Popover } from '@opnay/city-ds-react/popover';

function Contents({ description, title }: { description: string; title: string }) {
  return (
    <Popover.Portal>
      <Popover.Positioner sideOffset={8}>
        <Popover.Popup>
          <Popover.Title>{title}</Popover.Title>
          <Popover.Description>{description}</Popover.Description>
          <div className="mt-4 flex justify-end">
            <Popover.Close>확인</Popover.Close>
          </div>
          <Popover.Arrow />
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}

export default function PopoverControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="city-docs-example-matrix">
      <section className="city-docs-example-item">
        <strong>컴포넌트 소유</strong>
        <p>트리거가 비제어 열림 상태를 직접 관리합니다.</p>
        <Popover.Root>
          <Popover.Trigger>릴리스 정보</Popover.Trigger>
          <Contents
            description="v0.1.1이 8분 전에 프로덕션에 배포되었습니다."
            title="릴리스 정보"
          />
        </Popover.Root>
      </section>
      <section className="city-docs-example-item">
        <strong>외부 상태 소유</strong>
        <p>페이지 상태와 트리거가 같은 open 값을 공유합니다.</p>
        <div className="city-docs-example-row">
          <Button onClick={() => setOpen((value) => !value)} variant="secondary">
            외부에서 {open ? '닫기' : '열기'}
          </Button>
          <Popover.Root onOpenChange={setOpen} open={open}>
            <Popover.Trigger>배포 상태</Popover.Trigger>
            <Contents
              description="프로덕션 환경의 모든 서비스가 정상적으로 응답합니다."
              title="배포 상태"
            />
          </Popover.Root>
        </div>
        <span aria-live="polite" className="text-xs text-city-muted-foreground">
          현재 상태: {open ? '열림' : '닫힘'}
        </span>
      </section>
    </div>
  );
}
