import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { Table } from '@opnay/city-ds-react/table';

function ReleaseTable() {
  return (
    <Table.Root className="city-docs-example-wide">
      <Table.Body>
        <Table.Row>
          <Table.Cell>도시 데이터</Table.Cell>
          <Table.Cell>공개</Table.Cell>
          <Table.Cell>플랫폼 팀</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

export default function DataTableRegionHintExample() {
  return (
    <div className="city-docs-example-stack">
      <DataTableRegion
        hint="표를 가로로 스크롤해 나머지 열을 확인하십시오."
        label="스크롤 안내가 있는 발행 기록"
        showHint
      >
        <ReleaseTable />
      </DataTableRegion>
      <DataTableRegion
        hint="표를 가로로 스크롤해 나머지 열을 확인하십시오."
        label="스크롤 안내가 없는 발행 기록"
        showHint={false}
      >
        <ReleaseTable />
      </DataTableRegion>
    </div>
  );
}
