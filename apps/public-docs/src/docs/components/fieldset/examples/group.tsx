import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { Fieldset } from '@opnay/city-ds-react/fieldset';

export default function FieldsetGroupExample() {
  return (
    <div className="city-docs-example-stack">
      <Fieldset.Root appearance="outline">
        <Fieldset.Legend>알림 채널</Fieldset.Legend>
        <Fieldset.Description>운영 알림을 받을 채널을 선택하십시오.</Fieldset.Description>
        <Fieldset.Content>
          <div className="city-docs-example-row">
            <Checkbox aria-labelledby="fieldset-email-label" defaultChecked />
            <span id="fieldset-email-label">이메일</span>
          </div>
          <div className="city-docs-example-row">
            <Checkbox aria-labelledby="fieldset-sms-label" />
            <span id="fieldset-sms-label">문자</span>
          </div>
        </Fieldset.Content>
      </Fieldset.Root>
      <Fieldset.Root appearance="plain" aria-invalid="true">
        <Fieldset.Legend>배포 요일</Fieldset.Legend>
        <Fieldset.Content>
          <div className="city-docs-example-row">
            <Checkbox aria-labelledby="fieldset-weekday-label" />
            <span id="fieldset-weekday-label">평일</span>
          </div>
        </Fieldset.Content>
        <Fieldset.Error>하나 이상의 요일을 선택하십시오.</Fieldset.Error>
      </Fieldset.Root>
      <Fieldset.Root appearance="band" disabled>
        <Fieldset.Legend>관리 범위</Fieldset.Legend>
        <Fieldset.Description>조직 정책으로 잠긴 그룹입니다.</Fieldset.Description>
        <Fieldset.Content>
          <div className="city-docs-example-row">
            <Checkbox aria-labelledby="fieldset-seoul-label" defaultChecked />
            <span id="fieldset-seoul-label">서울</span>
          </div>
        </Fieldset.Content>
      </Fieldset.Root>
    </div>
  );
}
