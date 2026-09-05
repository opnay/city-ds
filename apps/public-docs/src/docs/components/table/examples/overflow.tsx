import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { Table } from '@opnay/city-ds-react/table';

const appearances = ['plain', 'band', 'outline'] as const;

function WideTable() {
  return (
    <Table.Root aria-label="스크롤할 수 있는 표" className="city-docs-example-overflow-table">
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
        <Table.Row>
          <Table.Cell>도로 공사 일정</Table.Cell>
          <Table.Cell>비공개</Table.Cell>
          <Table.Cell>작업 일정</Table.Cell>
          <Table.Cell>교통 운영 팀</Table.Cell>
          <Table.Cell>도심 권역</Table.Cell>
          <Table.Cell>담당자 전용</Table.Cell>
          <Table.Cell>2026-08-31 14:25</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}

export default function TableOverflowExample() {
  return (
    <div className="city-docs-example-stack">
      {appearances.map((appearance) => (
        <DataTableRegion
          appearance={appearance}
          label={`${appearance} 표 스크롤 영역`}
          key={appearance}
        >
          <WideTable />
        </DataTableRegion>
      ))}
    </div>
  );
}
