import { Input } from '@opnay/city-ds-react/input';

export default function InputStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-variant">
        <Input
          aria-invalid
          aria-label="프로젝트 이름"
          data-invalid=""
          placeholder="프로젝트 이름"
        />
      </div>
      <div className="city-docs-example-variant">
        <Input aria-label="프로젝트 이름" defaultValue="수정할 수 없습니다" disabled />
      </div>
    </div>
  );
}
