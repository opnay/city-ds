import { Button } from '@opnay/city-ds-react/button';
import { Dialog } from '@opnay/city-ds-react/dialog';

const scrollModes = ['none', 'body'] as const;

export default function DialogScrollExample() {
  return (
    <div className="city-docs-example-row">
      {scrollModes.map((scroll) => (
        <Dialog.Root key={scroll}>
          <Dialog.Trigger render={<Button variant="secondary" />}>{scroll} 스크롤</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Viewport>
              <Dialog.Popup scroll={scroll}>
                <Dialog.Header>
                  <div>
                    <Dialog.Title>{scroll} 스크롤</Dialog.Title>
                    <Dialog.Description>본문 스크롤 구조를 비교합니다.</Dialog.Description>
                  </div>
                </Dialog.Header>
                <Dialog.Body>길어진 내용은 선택한 영역에서 스크롤됩니다.</Dialog.Body>
                <Dialog.Footer>
                  <Dialog.Close render={<Button variant="secondary" />}>닫기</Dialog.Close>
                </Dialog.Footer>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
    </div>
  );
}
