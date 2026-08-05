import { Button } from '@opnay/city-ds-react/button';
import { Toast } from '@opnay/city-ds-react/toast';

function InteractiveToast() {
  const manager = Toast.useToastManager();

  return (
    <>
      <Button
        onClick={() =>
          manager.add({
            title: '저장되었습니다.',
            description: '변경 사항을 반영했습니다.',
            type: 'success',
          })
        }
      >
        알림 표시
      </Button>
      <Toast.Portal>
        <Toast.Viewport>
          {manager.toasts.map((toast) => (
            <Toast.Root appearance="outline" key={toast.id} toast={toast}>
              <Toast.Content>
                <div>
                  <Toast.Title />
                  <Toast.Description />
                </div>
                <Toast.Close />
              </Toast.Content>
            </Toast.Root>
          ))}
        </Toast.Viewport>
      </Toast.Portal>
    </>
  );
}

export default function ToastUsageExample() {
  return (
    <Toast.Provider timeout={0}>
      <InteractiveToast />
    </Toast.Provider>
  );
}
