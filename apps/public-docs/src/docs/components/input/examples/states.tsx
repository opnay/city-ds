import { Field } from '@opnay/city-ds-react/field';
import { Input } from '@opnay/city-ds-react/input';

export default function InputStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">오류</span>
        <Field.Root invalid>
          <Field.Label>프로젝트 이름</Field.Label>
          <Input placeholder="프로젝트 이름" />
          <Field.Error match>값을 확인하십시오.</Field.Error>
        </Field.Root>
      </div>
      <div className="city-docs-example-variant">
        <span className="city-docs-example-label">비활성</span>
        <Field.Root disabled>
          <Field.Label>프로젝트 이름</Field.Label>
          <Input defaultValue="수정할 수 없습니다" disabled />
        </Field.Root>
      </div>
    </div>
  );
}
