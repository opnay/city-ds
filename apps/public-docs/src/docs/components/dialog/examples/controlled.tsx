import { useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Dialog } from '@opnay/city-ds-react/dialog';

const dialogSizes = [
  { label: 'SM', size: 'sm' },
  { label: 'MD', size: 'md' },
  { label: 'LG', size: 'lg' },
  { label: 'XL', size: 'xl' },
  { label: '전체', size: 'full' },
] as const;

type DialogSize = (typeof dialogSizes)[number]['size'];

export default function DialogControlledExample() {
  const [openSize, setOpenSize] = useState<DialogSize | null>(null);

  return (
    <div className="city-docs-example-row">
      {dialogSizes.map(({ label, size }) => (
        <Dialog.Root
          key={size}
          onOpenChange={(open) => setOpenSize(open ? size : null)}
          open={openSize === size}
        >
          <Dialog.Trigger render={<Button variant="secondary" />}>{label} 크기</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Viewport>
              <Dialog.Popup size={size}>
                <Dialog.Header>
                  <div>
                    <Dialog.Title>프로젝트 세부 정보</Dialog.Title>
                    <Dialog.Description>
                      운영에 필요한 핵심 정보와 공개 범위를 확인합니다.
                    </Dialog.Description>
                  </div>
                </Dialog.Header>
                <Dialog.Body>
                  <dl className="grid gap-3 text-sm">
                    <div className="flex items-center justify-between gap-6">
                      <dt className="text-city-muted-foreground">프로젝트</dt>
                      <dd className="font-medium">Atlas</dd>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                      <dt className="text-city-muted-foreground">소유자</dt>
                      <dd className="font-medium">플랫폼 팀</dd>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                      <dt className="text-city-muted-foreground">리전</dt>
                      <dd className="font-medium">서울</dd>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                      <dt className="text-city-muted-foreground">공개 범위</dt>
                      <dd className="font-medium">워크스페이스 멤버</dd>
                    </div>
                  </dl>
                </Dialog.Body>
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
