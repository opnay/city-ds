import { Button } from '@opnay/city-ds-react/button';
import { Toaster, toast } from '@opnay/city-ds-react/toast';

const toasterId = 'toast-usage';

function InteractiveToast() {
  return (
    <>
      <div className="city-docs-example-row">
        <Button
          onClick={() =>
            toast.success('저장되었습니다.', {
              description: '변경 사항을 반영했습니다.',
              toasterId,
            })
          }
        >
          저장
        </Button>
        <Button
          onClick={() =>
            toast.info('새로고침했습니다.', {
              description: '최신 상태를 불러왔습니다.',
              toasterId,
            })
          }
          variant="outline"
        >
          새로고침
        </Button>
        <Button
          onClick={() =>
            toast.error('상태를 확인하지 못했습니다.', {
              action: {
                label: '다시 확인',
                onClick: () => undefined,
              },
              description: '연결 상태를 확인하고 다시 시도하십시오.',
              toasterId,
            })
          }
          variant="outline"
        >
          상태 확인
        </Button>
      </div>
      <Toaster duration={Infinity} id={toasterId} />
    </>
  );
}

export default function ToastUsageExample() {
  return <InteractiveToast />;
}
