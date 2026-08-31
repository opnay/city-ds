import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Settings2 } from 'lucide-react';
import type { CityTheme, Density } from '@opnay/city-ds-react';
import { Button } from '@opnay/city-ds-react/button';
import { Menu } from '@opnay/city-ds-react/menu';

const PREVIEW_GRID_STORAGE_KEY = 'city-docs-preview-grid';
const PREVIEW_DENSITY_STORAGE_KEY = 'city-docs-preview-density';
const THEME_STORAGE_KEY = 'city-docs-theme';
const THEMES: readonly CityTheme[] = ['system', 'light', 'dark'];
const PREVIEW_DENSITIES: readonly Density[] = ['comfortable', 'compact'];

export type ResolvedTheme = Exclude<CityTheme, 'system'>;

interface PreviewSettingsContextValue {
  previewDensity: Density;
  previewGrid: boolean;
  resolvedTheme: ResolvedTheme;
  setPreviewDensity: (density: Density) => void;
  setPreviewGrid: (checked: boolean) => void;
  setTheme: (theme: CityTheme) => void;
  theme: CityTheme;
}

interface PreviewSettingsProviderProps {
  children: ReactNode;
}

const PreviewSettingsContext = createContext<PreviewSettingsContextValue | null>(null);

function isCityTheme(value: string | null): value is CityTheme {
  return THEMES.some((theme) => theme === value);
}

function isPreviewDensity(value: string | null): value is Density {
  return PREVIEW_DENSITIES.some((density) => density === value);
}

function readStoredTheme(): CityTheme {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isCityTheme(value) ? value : 'system';
  } catch {
    return 'system';
  }
}

function readSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function useSystemTheme(): ResolvedTheme {
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(readSystemTheme);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = () => setSystemTheme(media.matches ? 'dark' : 'light');

    updateSystemTheme();
    media.addEventListener('change', updateSystemTheme);
    return () => media.removeEventListener('change', updateSystemTheme);
  }, []);

  return systemTheme;
}

function readStoredPreviewGrid() {
  try {
    return window.localStorage.getItem(PREVIEW_GRID_STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

function readStoredPreviewDensity(): Density {
  try {
    const value = window.localStorage.getItem(PREVIEW_DENSITY_STORAGE_KEY);
    return isPreviewDensity(value) ? value : 'comfortable';
  } catch {
    return 'comfortable';
  }
}

export function usePreviewSettings() {
  const context = useContext(PreviewSettingsContext);

  if (!context) {
    throw new Error('Preview settings must be used within PreviewSettingsProvider.');
  }

  return context;
}

export function PreviewSettingsProvider({ children }: PreviewSettingsProviderProps) {
  const [previewDensity, setPreviewDensity] = useState<Density>(readStoredPreviewDensity);
  const [previewGrid, setPreviewGrid] = useState(readStoredPreviewGrid);
  const [theme, setTheme] = useState<CityTheme>(readStoredTheme);
  const systemTheme = useSystemTheme();
  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    if (theme === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The theme still applies for this session when storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.cityDocsPreviewDensity = previewDensity;

    try {
      window.localStorage.setItem(PREVIEW_DENSITY_STORAGE_KEY, previewDensity);
    } catch {
      // The density still applies for this session when storage is unavailable.
    }
  }, [previewDensity]);

  useEffect(() => {
    document.documentElement.dataset.cityDocsPreviewGrid = previewGrid ? 'on' : 'off';

    try {
      window.localStorage.setItem(PREVIEW_GRID_STORAGE_KEY, previewGrid ? 'on' : 'off');
    } catch {
      // The preview setting still applies for this session when storage is unavailable.
    }
  }, [previewGrid]);

  return (
    <PreviewSettingsContext.Provider
      value={{
        previewDensity,
        previewGrid,
        resolvedTheme,
        setPreviewDensity,
        setPreviewGrid,
        setTheme,
        theme,
      }}
    >
      {children}
    </PreviewSettingsContext.Provider>
  );
}

export function PreviewSettingsButton() {
  const { previewDensity, previewGrid, setPreviewDensity, setPreviewGrid, setTheme, theme } =
    usePreviewSettings();

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
              <Menu.GroupLabel>테마</Menu.GroupLabel>
              <Menu.RadioGroup
                onValueChange={(value) => {
                  if (isCityTheme(value)) setTheme(value);
                }}
                value={theme}
              >
                <Menu.RadioItem value="system">
                  <Menu.RadioItemIndicator />
                  시스템
                </Menu.RadioItem>
                <Menu.RadioItem value="light">
                  <Menu.RadioItemIndicator />
                  라이트
                </Menu.RadioItem>
                <Menu.RadioItem value="dark">
                  <Menu.RadioItemIndicator />
                  다크
                </Menu.RadioItem>
              </Menu.RadioGroup>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.GroupLabel>밀도</Menu.GroupLabel>
              <Menu.RadioGroup
                onValueChange={(value) => {
                  if (isPreviewDensity(value)) setPreviewDensity(value);
                }}
                value={previewDensity}
              >
                <Menu.RadioItem value="comfortable">
                  <Menu.RadioItemIndicator />
                  Comfortable
                </Menu.RadioItem>
                <Menu.RadioItem value="compact">
                  <Menu.RadioItemIndicator />
                  Compact
                </Menu.RadioItem>
              </Menu.RadioGroup>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.GroupLabel>보기</Menu.GroupLabel>
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
