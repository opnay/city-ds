import { Field } from '@opnay/city-ds-react/field';
import { Input } from '@opnay/city-ds-react/input';

export default function FieldStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <Field.Root>
          <Field.Label>프로젝트 이름</Field.Label>
          <Input defaultValue="city-ds" />
          <Field.Description>소문자, 숫자, 하이픈을 사용하십시오.</Field.Description>
        </Field.Root>
      </div>
      <div className="city-docs-example-variant">
        <Field.Root invalid>
          <Field.Label>프로젝트 이름</Field.Label>
          <Input defaultValue="city" />
          <Field.Error match>유효한 이름을 입력하십시오.</Field.Error>
        </Field.Root>
      </div>
      <div className="city-docs-example-variant">
        <Field.Root disabled>
          <Field.Label>프로젝트 이름</Field.Label>
          <Input defaultValue="city-ds" />
          <Field.Description>조직 정책으로 관리됩니다.</Field.Description>
        </Field.Root>
      </div>
    </div>
  );
}
