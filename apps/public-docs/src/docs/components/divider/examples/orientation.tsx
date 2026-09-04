import { Divider } from '@opnay/city-ds-react/divider';

export default function DividerOrientationExample() {
  return (
    <div className="city-docs-example-stack w-full">
      <Divider />
      <div className="city-docs-divider-vertical-height flex items-stretch gap-4 text-sm">
        <div className="flex flex-1 items-center justify-end">첫 영역</div>
        <Divider orientation="vertical" />
        <div className="flex flex-1 items-center">다음 영역</div>
      </div>
    </div>
  );
}
