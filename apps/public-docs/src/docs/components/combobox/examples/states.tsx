import { useState } from 'react';
import { Combobox } from '@opnay/city-ds-react/combobox';
import { Field } from '@opnay/city-ds-react/field';

const projects = ['도시 포털', '교통 지도', '허가 추적기'];

function ProjectOptions() {
  return (
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
  );
}

export default function ComboboxStatesExample() {
  const [value, setValue] = useState<string | null>('도시 포털');

  return (
    <div className="city-docs-example-stack">
      <Field.Root>
        <Field.Label>제어된 프로젝트</Field.Label>
        <Combobox.Root items={projects} onValueChange={setValue} value={value}>
          <Combobox.InputGroup>
            <Combobox.Input placeholder="프로젝트 검색" />
            <Combobox.Trigger />
          </Combobox.InputGroup>
          <ProjectOptions />
        </Combobox.Root>
      </Field.Root>
      <Field.Root>
        <Field.Label>비활성 프로젝트</Field.Label>
        <Combobox.Root disabled items={projects}>
          <Combobox.InputGroup>
            <Combobox.Input placeholder="프로젝트 검색" />
            <Combobox.Trigger />
          </Combobox.InputGroup>
          <ProjectOptions />
        </Combobox.Root>
      </Field.Root>
    </div>
  );
}
