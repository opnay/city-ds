import { Popover } from '@opnay/city-ds-react/popover';

function Contents({
  description,
  modal = false,
  title,
}: {
  description: string;
  modal?: boolean;
  title: string;
}) {
  return (
    <Popover.Portal>
      {modal ? <Popover.Backdrop /> : null}
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

export default function PopoverModalExample() {
  return (
    <div className="city-docs-example-matrix">
      <section className="city-docs-example-item">
        <strong>비모달</strong>
        <p>참고 정보를 확인하면서 배경 작업을 계속할 수 있습니다.</p>
        <Popover.Root modal={false}>
          <Popover.Trigger>단축키 안내</Popover.Trigger>
          <Contents
            description="⌘ K를 누르면 어디서든 명령 메뉴를 열 수 있습니다."
            title="단축키 안내"
          />
        </Popover.Root>
      </section>
      <section className="city-docs-example-item">
        <strong>모달</strong>
        <p>결정이 끝날 때까지 포커스와 상호작용을 패널에 한정합니다.</p>
        <Popover.Root modal>
          <Popover.Trigger>공유 범위 변경</Popover.Trigger>
          <Contents
            modal
            description="링크가 있는 모든 사용자가 프로젝트를 볼 수 있게 됩니다."
            title="공유 범위 변경"
          />
        </Popover.Root>
      </section>
    </div>
  );
}
