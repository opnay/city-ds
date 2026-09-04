import { Divider } from '@opnay/city-ds-react/divider';

export default function DividerUsageExample() {
  return (
    <div className="city-docs-example-stack w-full">
      <Divider />
      <Divider>섹션 구분</Divider>
      <Divider plain>또는</Divider>
    </div>
  );
}
