import { useState } from 'react';
import { AlertDialog } from '@opnay/city-ds-react/alert-dialog';
import { Button } from '@opnay/city-ds-react/button';

export default function AlertDialogConfirmExample() {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger render={<Button variant="destructive" />}>
        프로젝트 삭제
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Viewport>
          <AlertDialog.Popup>
            <AlertDialog.Title>Atlas 프로젝트를 삭제하시겠습니까?</AlertDialog.Title>
            <AlertDialog.Description>
              연결된 배포 12개와 활동 기록이 영구적으로 삭제되며 복구할 수 없습니다.
            </AlertDialog.Description>
            <div className="mt-5 flex justify-end gap-2">
              <AlertDialog.Cancel render={<Button variant="secondary" />}>취소</AlertDialog.Cancel>
              <AlertDialog.Action destructive render={<Button variant="destructive" />}>
                프로젝트 삭제
              </AlertDialog.Action>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
