import { useState } from 'react';
import { Combobox } from '@opnay/city-ds-react/combobox';
import { Field } from '@opnay/city-ds-react/field';

const projects = ['도시 포털', '교통 지도', '허가 추적기'];

function ProjectCombobox({
  disabled = false,
  multiple,
  size,
}: {
  disabled?: boolean;
  multiple: boolean;
  size: 'sm' | 'md' | 'lg';
}) {
  return (
    <Field.Root>
      <Field.Label>{multiple ? '담당자 여러 명' : '프로젝트'}</Field.Label>
      <Combobox.Root disabled={disabled} items={projects} multiple={multiple} size={size}>
        {multiple ? (
          <Combobox.InputGroup>
            <Combobox.Chips>
              <Combobox.InputRow>
                <Combobox.Input placeholder="검색" />
                <Combobox.Trigger />
              </Combobox.InputRow>
            </Combobox.Chips>
          </Combobox.InputGroup>
        ) : (
          <Combobox.InputGroup>
            <Combobox.Input placeholder="프로젝트 검색" />
            <Combobox.Trigger />
          </Combobox.InputGroup>
        )}
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.Empty>결과가 없습니다.</Combobox.Empty>
              <Combobox.List>
                {(item: string) => (
                  <Combobox.Item key={item} value={item}>
                    <Combobox.ItemIndicator />
                    {item}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Field.Root>
  );
}

function ControlledProjectCombobox() {
  const [value, setValue] = useState<string | null>('도시 포털');

  return (
    <Field.Root>
      <Field.Label>제어된 프로젝트</Field.Label>
      <Combobox.Root items={projects} onValueChange={setValue} value={value}>
        <Combobox.InputGroup>
          <Combobox.Input placeholder="프로젝트 검색" />
          <Combobox.Trigger />
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.Empty>결과가 없습니다.</Combobox.Empty>
              <Combobox.List>
                {(item: string) => (
                  <Combobox.Item key={item} value={item}>
                    <Combobox.ItemIndicator />
                    {item}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Field.Root>
  );
}

export default function ComboboxMatrixExample() {
  return (
    <div className="city-docs-example-stack">
      {(['sm', 'md', 'lg'] as const).flatMap((size) => [
        <ProjectCombobox key={`${size}-single`} multiple={false} size={size} />,
        <ProjectCombobox key={`${size}-multiple`} multiple size={size} />,
      ])}
      <ProjectCombobox disabled key="disabled" multiple={false} size="md" />
      <ControlledProjectCombobox />
    </div>
  );
}
