import type { ReactNode } from 'react';
import type { CityTheme, Density } from '@opnay/city-ds-react';
import { DensityProvider } from '@opnay/city-ds-react/density-provider';
import { SegmentedControl } from '@opnay/city-ds-react/segmented-control';
import { Select } from '@opnay/city-ds-react/select';
import { Switch } from '@opnay/city-ds-react/switch';

import type { OptionAxis, PreviewOptionValues } from '../docs/types';

type ResolvedTheme = Exclude<CityTheme, 'system'>;

interface PreviewOptionsConfig {
  axes: readonly OptionAxis[];
  id: string;
  onValueChange: (name: string, value: string) => void;
  open: boolean;
  values: PreviewOptionValues;
}

interface PreviewProps {
  children: ReactNode;
  density: Density;
  layout: 'center' | 'wide';
  options?: PreviewOptionsConfig | undefined;
  theme: ResolvedTheme;
}

function isBooleanOptionAxis(axis: OptionAxis) {
  return (
    axis.control === 'switch' ||
    (axis.values.length === 2 && axis.values.includes('false') && axis.values.includes('true'))
  );
}

function getOptionOrder(axis: OptionAxis) {
  if (axis.name === 'density') return 0;
  if (axis.name === 'size') return 1;
  if (axis.name === 'disabled') return 4;
  if (isBooleanOptionAxis(axis)) return 3;
  return 2;
}

function orderOptionAxes(axes: readonly OptionAxis[]) {
  return axes
    .map((axis, index) => ({ axis, index }))
    .sort((left, right) => {
      const rankDifference = getOptionOrder(left.axis) - getOptionOrder(right.axis);
      return rankDifference === 0 ? left.index - right.index : rankDifference;
    })
    .map(({ axis }) => axis);
}

function PreviewOptions({ axes, id, onValueChange, open, values }: PreviewOptionsConfig) {
  return (
    <aside aria-label="미리보기 옵션" className="city-docs-preview-sidebar" hidden={!open} id={id}>
      <div className="city-docs-preview-options">
        {orderOptionAxes(axes).map((axis) => {
          const value = values[axis.name] ?? axis.defaultValue ?? axis.values[0] ?? '';

          if (isBooleanOptionAxis(axis)) {
            const labelId = `${id}-${axis.name}`;

            return (
              <div className="city-docs-preview-option-switch" key={axis.name}>
                <code id={labelId}>{axis.name}</code>
                <Switch
                  aria-labelledby={labelId}
                  checked={value === 'true'}
                  onCheckedChange={(checked) => onValueChange(axis.name, String(checked))}
                  size="sm"
                />
              </div>
            );
          }

          if (axis.control === 'segmented') {
            const labelId = `${id}-${axis.name}`;

            return (
              <div className="city-docs-preview-option-field" key={axis.name}>
                <code id={labelId}>{axis.name}</code>
                <SegmentedControl
                  aria-labelledby={labelId}
                  className="city-docs-preview-option-segmented"
                  onValueChange={(nextValue) => onValueChange(axis.name, nextValue)}
                  size="sm"
                  value={value}
                >
                  {axis.values.map((option) => (
                    <SegmentedControl.Item key={option} value={option}>
                      {option}
                    </SegmentedControl.Item>
                  ))}
                </SegmentedControl>
              </div>
            );
          }

          const items = Object.fromEntries(axis.values.map((option) => [option, option]));

          return (
            <div className="city-docs-preview-option-field" key={axis.name}>
              <Select.Root
                items={items}
                onValueChange={(nextValue) => {
                  if (typeof nextValue === 'string') onValueChange(axis.name, nextValue);
                }}
                size="sm"
                value={value}
              >
                <Select.Label className="mb-0">
                  <code>{axis.name}</code>
                </Select.Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner sideOffset={6}>
                    <Select.Popup>
                      <Select.List>
                        {axis.values.map((option) => (
                          <Select.Item key={option} value={option}>
                            <Select.ItemIndicator />
                            <Select.ItemText>{option}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export function Preview({ children, density, layout, options, theme }: PreviewProps) {
  return (
    <div
      className="city-docs-example-preview"
      data-sidebar-open={options?.open ? '' : undefined}
      data-theme={theme}
    >
      <div className="city-docs-example-preview-canvas">
        <DensityProvider
          className="city-docs-example-preview-content"
          data-city-docs-layout={layout}
          density={density}
        >
          {children}
        </DensityProvider>
      </div>
      {options ? <PreviewOptions {...options} /> : null}
    </div>
  );
}
