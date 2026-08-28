import { Button } from '@opnay/city-ds-react/button';
import { Toaster, toast } from '@opnay/city-ds-react/toast';

const toasterId = 'toast-presentation';

const tones = [
  { label: 'neutral', show: () => toast('neutral', { toasterId }) },
  { label: 'info', show: () => toast.info('info', { toasterId }) },
  { label: 'success', show: () => toast.success('success', { toasterId }) },
  { label: 'warning', show: () => toast.warning('warning', { toasterId }) },
  { label: 'destructive', show: () => toast.error('destructive', { toasterId }) },
] as const;

export default function ToastPresentationExample() {
  return (
    <>
      <div className="city-docs-example-row">
        {tones.map(({ label, show }) => (
          <Button key={label} onClick={show} variant="outline">
            {label}
          </Button>
        ))}
      </div>
      <Toaster duration={Infinity} id={toasterId} visibleToasts={5} />
    </>
  );
}
