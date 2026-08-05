import { Alert } from '@opnay/city-ds-react/alert';

export default function AlertIconsExample() {
  return (
    <div className="city-docs-example-stack">
      <Alert.Root showIcon>
        <Alert.Title>아이콘 표시</Alert.Title>
        <Alert.Description>의미를 빠르게 구분할 수 있습니다.</Alert.Description>
      </Alert.Root>
      <Alert.Root showIcon={false}>
        <Alert.Title>아이콘 숨김</Alert.Title>
        <Alert.Description>텍스트만으로도 의미를 전달합니다.</Alert.Description>
      </Alert.Root>
    </div>
  );
}
