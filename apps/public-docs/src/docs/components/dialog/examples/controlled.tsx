import { useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Dialog } from '@opnay/city-ds-react/dialog';

const dialogs = [
  { size: 'sm', scroll: 'none', trigger: 'sm Dialog' },
  { size: 'md', scroll: 'body', trigger: '세부 정보' },
  { size: 'lg', scroll: 'none', trigger: 'lg Dialog' },
  { size: 'xl', scroll: 'body', trigger: 'xl Dialog' },
  { size: 'full', scroll: 'body', trigger: 'full Dialog' },
] as const;

type DialogSize = (typeof dialogs)[number]['size'];

export default function DialogControlledExample() {
  const [openSize, setOpenSize] = useState<DialogSize | null>(null);

  return (
    <div className="city-docs-example-row">
      {dialogs.map(({ scroll, size, trigger }) => {
        const isPrimaryExample = size === 'md';

        return (
          <Dialog.Root
            key={size}
            onOpenChange={(open) => setOpenSize(open ? size : null)}
            open={openSize === size}
          >
            <Dialog.Trigger render={<Button variant="secondary" />}>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop />
              <Dialog.Viewport>
                <Dialog.Popup scroll={scroll} size={size}>
                  <Dialog.Header>
                    <div>
                      <Dialog.Title>
                        {isPrimaryExample ? '프로젝트 세부 정보' : `${size} Dialog`}
                      </Dialog.Title>
                      <Dialog.Description>
                        {isPrimaryExample
                          ? '현재 페이지를 벗어나지 않고 확인합니다.'
                          : `${scroll} 스크롤 구조를 확인합니다.`}
                      </Dialog.Description>
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
        );
      })}
    </div>
  );
}
