import { useState } from 'react';
import { AlertDialog } from '@opnay/city-ds-react/alert-dialog';
import { Button } from '@opnay/city-ds-react/button';

export default function AlertDialogConfirmExample() {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger render={<Button variant="destructive" />}>초안 삭제</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Viewport>
          <AlertDialog.Popup>
            <AlertDialog.Title>초안을 삭제하시겠습니까?</AlertDialog.Title>
            <AlertDialog.Description>이 작업은 되돌릴 수 없습니다.</AlertDialog.Description>
            <div className="city-docs-example-actions">
              <AlertDialog.Cancel render={<Button variant="secondary" />}>취소</AlertDialog.Cancel>
              <AlertDialog.Action destructive render={<Button variant="destructive" />}>
                삭제
              </AlertDialog.Action>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
