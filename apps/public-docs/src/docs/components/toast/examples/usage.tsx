import { Button } from '@opnay/city-ds-react/button';
import { Toast } from '@opnay/city-ds-react/toast';

type ToastUsageData = {
  actionLabel?: string;
};

function InteractiveToast() {
  const manager = Toast.useToastManager<ToastUsageData>();

  return (
    <>
      <div className="city-docs-example-row">
        <Button
          onClick={() =>
            manager.add({
              title: '저장되었습니다.',
              description: '변경 사항을 반영했습니다.',
              type: 'success',
            })
          }
        >
          저장
        </Button>
        <Button
          onClick={() =>
            manager.add({
              title: '새로고침했습니다.',
              description: '최신 상태를 불러왔습니다.',
              type: 'info',
            })
          }
          variant="outline"
        >
          새로고침
        </Button>
        <Button
          onClick={() =>
            manager.add({
              data: { actionLabel: '다시 확인' },
              title: '상태를 확인하지 못했습니다.',
              description: '연결 상태를 확인하고 다시 시도하십시오.',
              type: 'error',
            })
          }
          variant="outline"
        >
          상태 확인
        </Button>
      </div>
      <Toast.Portal>
        <Toast.Viewport>
          {manager.toasts.map((toast) => (
            <Toast.Root key={toast.id} toast={toast}>
              <Toast.Content>
                <div>
                  <Toast.Title />
                  <Toast.Description />
                </div>
                {toast.data?.actionLabel ? (
                  <Toast.Action>{toast.data.actionLabel}</Toast.Action>
                ) : null}
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
