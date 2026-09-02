import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { Table } from '@opnay/city-ds-react/table';

function ReleaseTable() {
  return (
    <Table.Root className="city-docs-example-overflow-table">
      <Table.Header>
        <Table.Row>
          <Table.Head>데이터셋</Table.Head>
          <Table.Head>상태</Table.Head>
          <Table.Head>유형</Table.Head>
          <Table.Head>담당 조직</Table.Head>
          <Table.Head>대상 지역</Table.Head>
          <Table.Head>공개 범위</Table.Head>
          <Table.Head>갱신 일시</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>도시 생활 인구</Table.Cell>
          <Table.Cell>공개</Table.Cell>
          <Table.Cell>실시간 통계</Table.Cell>
          <Table.Cell>플랫폼 팀</Table.Cell>
          <Table.Cell>서울 전역</Table.Cell>
          <Table.Cell>공공 데이터 포털</Table.Cell>
          <Table.Cell>2026-09-02 09:30</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>도시 공원 시설</Table.Cell>
          <Table.Cell>검토 중</Table.Cell>
          <Table.Cell>시설 현황</Table.Cell>
          <Table.Cell>공원 운영 팀</Table.Cell>
          <Table.Cell>25개 자치구</Table.Cell>
          <Table.Cell>내부 운영 도구</Table.Cell>
          <Table.Cell>2026-09-01 18:10</Table.Cell>
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
