import { Input, Textarea } from '@opnay/city-ds-react/input';

export default function InputTextareaExample() {
  return (
    <div className="city-docs-example-stack">
      <Input aria-label="제목" placeholder="한 줄 제목" />
      <Textarea aria-label="설명" placeholder="여러 줄 설명" />
    </div>
  );
}
