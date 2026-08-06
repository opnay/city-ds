import { createContext, useContext, useEffect, useId, useState, type ReactNode } from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@opnay/city-ds-react/button';
import { Popover } from '@opnay/city-ds-react/popover';
import { Switch } from '@opnay/city-ds-react/switch';

const PREVIEW_GRID_STORAGE_KEY = 'city-docs-preview-grid';

interface PreviewSettingsContextValue {
  previewGrid: boolean;
  setPreviewGrid: (checked: boolean) => void;
}

interface PreviewSettingsProviderProps {
  children: ReactNode;
}

const PreviewSettingsContext = createContext<PreviewSettingsContextValue | null>(null);

function readStoredPreviewGrid() {
  try {
    return window.localStorage.getItem(PREVIEW_GRID_STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

function usePreviewSettings() {
  const context = useContext(PreviewSettingsContext);

  if (!context) {
    throw new Error('Preview settings must be used within PreviewSettingsProvider.');
  }

  return context;
}

export function PreviewSettingsProvider({ children }: PreviewSettingsProviderProps) {
  const [previewGrid, setPreviewGrid] = useState(readStoredPreviewGrid);

  useEffect(() => {
    document.documentElement.dataset.cityDocsPreviewGrid = previewGrid ? 'on' : 'off';

    try {
      window.localStorage.setItem(PREVIEW_GRID_STORAGE_KEY, previewGrid ? 'on' : 'off');
    } catch {
      // The preview setting still applies for this session when storage is unavailable.
    }
  }, [previewGrid]);

  return (
    <PreviewSettingsContext.Provider value={{ previewGrid, setPreviewGrid }}>
      {children}
    </PreviewSettingsContext.Provider>
  );
}

export function PreviewSettingsButton() {
  const labelId = useId();
  const { previewGrid, setPreviewGrid } = usePreviewSettings();

  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <Button aria-label="미리보기 설정" iconOnly size="sm" type="button" variant="outline" />
        }
      >
        <Settings2 aria-hidden="true" size={16} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner align="end" sideOffset={8}>
          <Popover.Popup>
            <Popover.Title>미리보기 설정</Popover.Title>
            <Popover.Description>
              이 문서의 모든 컴포넌트 미리보기에 적용됩니다.
            </Popover.Description>
            <div className="city-docs-preview-settings-option">
              <div>
                <strong id={labelId}>격자 보기</strong>
                <span>배경의 정렬 격자를 표시합니다.</span>
              </div>
              <Switch
                aria-labelledby={labelId}
                checked={previewGrid}
                onCheckedChange={setPreviewGrid}
                size="sm"
              />
            </div>
            <Popover.Arrow />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
