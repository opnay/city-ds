import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@opnay/city-ds-react/button';
import { Menu } from '@opnay/city-ds-react/menu';

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
  const { previewGrid, setPreviewGrid } = usePreviewSettings();

  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <Button aria-label="미리보기 설정" iconOnly size="sm" type="button" variant="outline" />
        }
      >
        <Settings2 aria-hidden="true" size={16} />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={8}>
          <Menu.Popup aria-label="미리보기 설정">
            <Menu.Group>
              <Menu.GroupLabel>미리보기 설정</Menu.GroupLabel>
              <Menu.CheckboxItem checked={previewGrid} onCheckedChange={setPreviewGrid}>
                <Menu.CheckboxItemIndicator />
                격자 보기
              </Menu.CheckboxItem>
            </Menu.Group>
            <Menu.Arrow />
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
