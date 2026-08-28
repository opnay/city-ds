import { useEffect, useRef } from 'react';
import { Toast } from '@opnay/city-ds-react/toast';

const tones = ['neutral', 'info', 'success', 'warning', 'destructive'] as const;

type ToastPresentation = {
  tone: (typeof tones)[number];
};

function ToastPresentationGrid() {
  const manager = Toast.useToastManager<ToastPresentation>();
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;

    tones.forEach((tone) => {
      manager.add({
        data: { tone },
        description: `${tone} 의미의 background 92%·tone 8% 배경과 원색 border·텍스트입니다.`,
        id: `toast-${tone}`,
        timeout: 0,
        title: tone,
        type: tone === 'destructive' ? 'error' : tone,
      });
    });
  }, [manager]);

  return (
    <div aria-label="토스트 의미 행렬" className="city-docs-example-grid">
      {manager.toasts.map((toast) => {
        if (!toast.data) return null;

        return (
          <Toast.Root
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
    <Toast.Provider limit={5} timeout={0}>
      <ToastPresentationGrid />
    </Toast.Provider>
  );
}
