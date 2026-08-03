import { Button } from '@opnay/city-ds-react/button';
import { EmptyState } from '@opnay/city-ds-react/empty-state';

export default function EmptyStateExample() {
  return (
    <div className="city-docs-example-stack">
      <EmptyState.Root density="default">
        <EmptyState.Icon>□</EmptyState.Icon>
        <EmptyState.Title>아직 데이터가 없습니다</EmptyState.Title>
        <EmptyState.Description>첫 레코드를 추가해 이 표를 채우십시오.</EmptyState.Description>
        <EmptyState.Actions>
          <Button>레코드 추가</Button>
          <Button variant="outline">도움말</Button>
        </EmptyState.Actions>
      </EmptyState.Root>
      <EmptyState.Root density="compact">
        <EmptyState.Title level={3}>검색 결과가 없습니다</EmptyState.Title>
        <EmptyState.Description>검색어 또는 필터를 조정하십시오.</EmptyState.Description>
      </EmptyState.Root>
    </div>
  );
}
