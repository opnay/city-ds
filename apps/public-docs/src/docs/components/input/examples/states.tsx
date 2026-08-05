import { Field } from '@opnay/city-ds-react/field';
import { Input } from '@opnay/city-ds-react/input';

export default function InputStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <Field.Root invalid>
        <Field.Label>오류 입력</Field.Label>
        <Field.Control render={<Input placeholder="오류 상태" />} />
        <Field.Error match>값을 확인하십시오.</Field.Error>
      </Field.Root>
      <Input aria-label="비활성 입력" defaultValue="수정할 수 없습니다" disabled />
    </div>
  );
}
