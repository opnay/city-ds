import { Table } from '@opnay/city-ds-react/table';

export default function TableStatesExample() {
  return (
    <div className="city-docs-example-stack">
      <Table.Root aria-label="빈 테이블">
        <Table.Body>
          <Table.StateRow colSpan={2}>결과가 없습니다.</Table.StateRow>
        </Table.Body>
      </Table.Root>
      <Table.Root aria-label="로딩 테이블">
        <Table.Body>
          <Table.StateRow colSpan={2} status="loading">
            불러오는 중입니다.
          </Table.StateRow>
        </Table.Body>
      </Table.Root>
    </div>
  );
}
