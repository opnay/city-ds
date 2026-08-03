import { Table } from '@opnay/city-ds-react/table';
const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['line', 'surface'] as const;
const scrollAppearances = ['plain', 'band', 'outline'] as const;
function Sample({ size, variant }: { size: 'sm' | 'md' | 'lg'; variant: 'line' | 'surface' }) {
  return (
    <Table.Root
      aria-label={`${size} ${variant} 테이블`}
      className="city-docs-example-wide"
      size={size}
      variant={variant}
    >
      <Table.Header>
        <Table.Row>
          <Table.Head>이름</Table.Head>
          <Table.Head>상태</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>도시</Table.Cell>
          <Table.Cell>활성</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
}
export default function TableMatrixExample() {
  return (
    <div className="city-docs-example-stack">
      {variants.flatMap((variant) =>
        sizes.map((size, index) => (
          <Table.ScrollArea
            appearance={scrollAppearances[index]!}
            aria-label={`${size} ${variant} 표 스크롤 영역`}
            className="city-docs-example-narrow"
            key={`${size}-${variant}`}
          >
            <Sample size={size} variant={variant} />
          </Table.ScrollArea>
        )),
      )}
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
