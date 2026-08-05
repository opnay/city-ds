import { Callout } from '@opnay/city-ds-react/callout';

export default function CalloutIconsExample() {
  return (
    <div className="city-docs-example-stack">
      <Callout.Root showIcon>
        <Callout.Title>아이콘 표시</Callout.Title>
        <Callout.Description>문서에서 안내 의미를 빠르게 구분합니다.</Callout.Description>
      </Callout.Root>
      <Callout.Root showIcon={false}>
        <Callout.Title>아이콘 숨김</Callout.Title>
        <Callout.Description>텍스트 중심 문맥을 유지합니다.</Callout.Description>
      </Callout.Root>
    </div>
  );
}
