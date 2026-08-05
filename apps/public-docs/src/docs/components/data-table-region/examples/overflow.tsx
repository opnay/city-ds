import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { Table } from '@opnay/city-ds-react/table';

const appearances = ['plain', 'band', 'outline'] as const;

function ReleaseTable() {
  return (
    <Table.Root className="city-docs-example-wide">
      <Table.Header>
        <Table.Row>
          <Table.Head>이름</Table.Head>
          <Table.Head>상태</Table.Head>
          <Table.Head>담당자</Table.Head>
          <Table.Head>갱신 일시</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>도시 데이터</Table.Cell>
          <Table.Cell>공개</Table.Cell>
          <Table.Cell>플랫폼 팀</Table.Cell>
          <Table.Cell>2026-08-02</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

export default function DataTableRegionOverflowExample() {
  return (
    <div className="city-docs-example-stack">
      {appearances.map((appearance) => (
        <div className="city-docs-example-narrow" key={appearance}>
          <DataTableRegion
            appearance={appearance}
            hint="표를 가로로 스크롤해 나머지 열을 확인하십시오."
            label={`${appearance} 발행 기록`}
          >
            <ReleaseTable />
          </DataTableRegion>
        </div>
      ))}
    </div>
  );
}
