import { Table } from '@opnay/city-ds-react/table';

const appearances = ['plain', 'band', 'outline'] as const;

function WideTable() {
  return (
    <Table.Root aria-label="스크롤할 수 있는 표" className="city-docs-example-wide">
      <Table.Header>
        <Table.Row>
          <Table.Head>이름</Table.Head>
          <Table.Head>상태</Table.Head>
          <Table.Head>담당자</Table.Head>
        </Table.Row>
      </Table.Header>
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

export default function TableOverflowExample() {
  return (
    <div className="city-docs-example-stack">
      {appearances.map((appearance) => (
        <Table.ScrollArea
          appearance={appearance}
          aria-label={`${appearance} 표 스크롤 영역`}
          className="city-docs-example-narrow"
          key={appearance}
        >
          <WideTable />
        </Table.ScrollArea>
      ))}
    </div>
  );
}
