import { Combobox } from '@opnay/city-ds-react/combobox';

const projects = ['도시 포털', '교통 지도', '허가 추적기'];
const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

function ProjectCombobox({
  multiple,
  size,
}: {
  multiple: boolean;
  size: 'xsm' | 'sm' | 'md' | 'lg' | 'xlg';
}) {
  return (
    <div className="city-docs-example-variant">
      <span className="city-docs-example-label">
        {size} · {multiple ? '복수' : '단일'}
      </span>
      <Combobox.Root items={projects} multiple={multiple} size={size}>
        {multiple ? (
          <Combobox.InputGroup>
            <Combobox.Chips>
              <Combobox.InputRow>
                <Combobox.Input aria-label="프로젝트" placeholder="검색" />
                <Combobox.Trigger />
              </Combobox.InputRow>
            </Combobox.Chips>
          </Combobox.InputGroup>
        ) : (
          <Combobox.InputGroup>
            <Combobox.Input aria-label="프로젝트" placeholder="프로젝트 검색" />
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
