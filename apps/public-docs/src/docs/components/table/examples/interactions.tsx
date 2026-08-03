import { useMemo, useState } from 'react';
import { Table, type TableSortDirection } from '@opnay/city-ds-react/table';

const INITIAL_ROWS = [
  { id: 'river', name: '한강', status: '점검 중' },
  { id: 'park', name: '도시 공원', status: '정상' },
] as const;

export default function TableInteractionsExample() {
  const [direction, setDirection] = useState<TableSortDirection | false>(false);
  const [selected, setSelected] = useState<string[]>(['river']);
  const rows = useMemo(() => {
    if (direction === false) return INITIAL_ROWS;
    return [...INITIAL_ROWS].sort((left, right) => {
      const result = left.name.localeCompare(right.name, 'ko-KR');
      return direction === 'asc' ? result : -result;
    });
  }, [direction]);
  const allSelected = selected.length === rows.length;
  const selectionState = allSelected ? true : selected.length > 0 ? 'indeterminate' : false;

  const setRowSelected = (id: string, checked: boolean) => {
    setSelected((current) =>
      checked ? [...new Set([...current, id])] : current.filter((item) => item !== id),
    );
  };

  return (
    <Table.Root aria-label="정렬하고 선택할 수 있는 장소" variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.SelectionHead
            checked={selectionState}
            label="모든 장소 선택"
            onCheckedChange={(checked) => setSelected(checked ? rows.map((row) => row.id) : [])}
          />
          <Table.Head
            aria-sort={
              direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'
            }
          >
            <Table.SortButton direction={direction} onDirectionChange={setDirection}>
              이름
            </Table.SortButton>
          </Table.Head>
          <Table.Head>상태</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.id}>
            <Table.SelectionCell
              checked={selected.includes(row.id)}
              label={`${row.name} 선택`}
              onCheckedChange={(checked) => setRowSelected(row.id, checked)}
            />
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
