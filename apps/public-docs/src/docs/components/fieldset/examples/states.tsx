import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { Fieldset } from '@opnay/city-ds-react/fieldset';

export default function FieldsetStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <Fieldset.Root aria-invalid="true">
        <Fieldset.Legend>배포 요일</Fieldset.Legend>
        <Fieldset.Content className="grid-cols-2">
          <div className="city-docs-example-row">
            <Checkbox aria-labelledby="fieldset-weekday-label" />
            <span id="fieldset-weekday-label">평일</span>
          </div>
          <div className="city-docs-example-row">
            <Checkbox aria-labelledby="fieldset-weekend-label" />
            <span id="fieldset-weekend-label">주말</span>
          </div>
        </Fieldset.Content>
        <Fieldset.Error>하나 이상의 요일을 선택하십시오.</Fieldset.Error>
      </Fieldset.Root>
      <Fieldset.Root disabled>
        <Fieldset.Legend>관리 범위</Fieldset.Legend>
        <Fieldset.Description>조직 정책으로 잠긴 그룹입니다.</Fieldset.Description>
        <Fieldset.Content className="grid-cols-2">
          <div className="city-docs-example-row">
            <Checkbox aria-labelledby="fieldset-seoul-label" defaultChecked />
            <span id="fieldset-seoul-label">서울</span>
          </div>
          <div className="city-docs-example-row">
            <Checkbox aria-labelledby="fieldset-gyeonggi-label" />
            <span id="fieldset-gyeonggi-label">경기</span>
          </div>
        </Fieldset.Content>
      </Fieldset.Root>
    </div>
  );
}
