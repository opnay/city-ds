import { Combobox } from '@opnay/city-ds-react/combobox';
import { Field } from '@opnay/city-ds-react/field';

const projects = ['도시 포털', '교통 지도', '허가 추적기'];
const sizes = ['sm', 'md', 'lg'] as const;

function ProjectCombobox({ multiple, size }: { multiple: boolean; size: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="city-docs-example-variant">
      <span className="city-docs-example-label">
        {size} · {multiple ? '복수' : '단일'}
      </span>
      <Field.Root>
        <Field.Label>프로젝트</Field.Label>
        <Combobox.Root items={projects} multiple={multiple} size={size}>
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
    </div>
  );
}

export default function ComboboxSelectionExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.flatMap((size) => [
        <ProjectCombobox key={`${size}-single`} multiple={false} size={size} />,
        <ProjectCombobox key={`${size}-multiple`} multiple size={size} />,
      ])}
    </div>
  );
}
