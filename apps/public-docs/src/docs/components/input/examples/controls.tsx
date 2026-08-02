import { Field } from '@opnay/city-ds-react/field';
import { Input, InputGroup, Textarea } from '@opnay/city-ds-react/input';

export default function InputControlsExample() {
  return (
    <div className="city-docs-example-stack">
      <Input aria-label="작은 입력" placeholder="작은 입력" size="sm" />
      <Field.Root invalid>
        <Field.Label>오류 입력</Field.Label>
        <Field.Control render={<Input placeholder="오류 상태" size="md" />} />
        <Field.Error match>값을 확인하십시오.</Field.Error>
      </Field.Root>
      <InputGroup.Root size="lg">
        <InputGroup.Addon>https://</InputGroup.Addon>
        <Input aria-label="주소" placeholder="example.com" />
        <InputGroup.Addon position="trailing">.gov</InputGroup.Addon>
      </InputGroup.Root>
      <Input aria-label="비활성 입력" defaultValue="수정할 수 없습니다" disabled size="md" />
      <Textarea aria-label="설명" placeholder="여러 줄 설명" size="md" />
    </div>
  );
}
