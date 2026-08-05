import { Table } from '@opnay/city-ds-react/table';

const sizes = ['sm', 'md', 'lg'] as const;
const variants = ['line', 'surface'] as const;

function Sample({ size, variant }: { size: 'sm' | 'md' | 'lg'; variant: 'line' | 'surface' }) {
  return (
    <Table.Root aria-label={`${size} ${variant} 테이블`} size={size} variant={variant}>
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

export default function TablePresentationExample() {
  return (
    <div className="city-docs-example-stack">
      {variants.flatMap((variant) =>
        sizes.map((size) => <Sample key={`${size}-${variant}`} size={size} variant={variant} />),
      )}
    </div>
  );
}
