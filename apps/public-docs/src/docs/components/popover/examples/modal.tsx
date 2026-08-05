import { Popover } from '@opnay/city-ds-react/popover';

function Contents({ label }: { label: string }) {
  return (
    <Popover.Portal>
      <Popover.Positioner sideOffset={8}>
        <Popover.Popup>
          <Popover.Title>{label}</Popover.Title>
          <Popover.Description>포커스 동작을 문맥에 맞게 선택합니다.</Popover.Description>
          <Popover.Close>닫기</Popover.Close>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}

export default function PopoverModalExample() {
  return (
    <div className="city-docs-example-row">
      <Popover.Root modal={false}>
        <Popover.Trigger>비모달 패널</Popover.Trigger>
        <Contents label="비모달 패널" />
      </Popover.Root>
      <Popover.Root modal>
        <Popover.Trigger>모달 패널</Popover.Trigger>
        <Contents label="모달 패널" />
      </Popover.Root>
    </div>
  );
}
