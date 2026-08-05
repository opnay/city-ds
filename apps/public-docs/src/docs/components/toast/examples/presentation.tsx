import { useEffect, useRef } from 'react';
import { Toast } from '@opnay/city-ds-react/toast';

const tones = ['neutral', 'info', 'success', 'warning', 'destructive'] as const;
const appearances = ['outline', 'subtle'] as const;

type ToastPresentation = {
  tone: (typeof tones)[number];
  appearance: (typeof appearances)[number];
};

function ToastPresentationGrid() {
  const manager = Toast.useToastManager<ToastPresentation>();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;

    tones.forEach((tone) => {
      appearances.forEach((appearance) => {
        manager.add({
          data: { appearance, tone },
          description: `${tone} 의미의 ${appearance} 표면입니다.`,
          id: `toast-${tone}-${appearance}`,
          timeout: 0,
          title: `${tone} · ${appearance}`,
          type: tone === 'destructive' ? 'error' : tone,
        });
      });
    });
  }, [manager]);

  return (
    <div aria-label="토스트 옵션 행렬" className="city-docs-example-grid">
      {manager.toasts.map((toast) => {
        if (!toast.data) return null;

        return (
          <Toast.Root
            appearance={toast.data.appearance}
            key={toast.id}
            role="presentation"
            tabIndex={-1}
            toast={toast}
            tone={toast.data.tone}
          >
            <Toast.Content>
              <div>
                <Toast.Title />
                <Toast.Description />
              </div>
            </Toast.Content>
          </Toast.Root>
        );
      })}
    </div>
  );
}

export default function ToastPresentationExample() {
  return (
    <Toast.Provider limit={10} timeout={0}>
      <ToastPresentationGrid />
    </Toast.Provider>
  );
}
