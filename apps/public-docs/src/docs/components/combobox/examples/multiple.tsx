import { Combobox } from '@opnay/city-ds-react/combobox';

const projects = ['도시 포털', '교통 지도', '허가 추적기'];
const sizes = ['xsm', 'sm', 'md', 'lg', 'xlg'] as const;

export default function ComboboxMultipleExample() {
  return (
    <div className="city-docs-example-stack">
      {sizes.map((size) => (
        <div className="city-docs-example-variant" key={size}>
          <Combobox.Root
            defaultValue={['도시 포털', '교통 지도']}
            items={projects}
            multiple
            size={size}
          >
            <Combobox.InputGroup>
              <Combobox.Chips>
                <Combobox.InputRow>
                  <Combobox.Input aria-label={`${size} 프로젝트`} placeholder="프로젝트 검색" />
                  <Combobox.Clear aria-label="모든 프로젝트 지우기" />
                  <Combobox.Trigger aria-label="프로젝트 목록 열기" />
                </Combobox.InputRow>
                <Combobox.Value>
                  {(selectedProjects: string[]) =>
                    selectedProjects.map((project) => (
                      <Combobox.Chip key={project}>
                        {project}
                        <Combobox.ChipRemove aria-label={`${project} 제거`} />
                      </Combobox.Chip>
                    ))
                  }
                </Combobox.Value>
              </Combobox.Chips>
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
        </div>
      ))}
    </div>
  );
}
