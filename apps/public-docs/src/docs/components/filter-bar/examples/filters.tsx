import { useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { Field } from '@opnay/city-ds-react/field';
import { FilterBar } from '@opnay/city-ds-react/filter-bar';
import { Input } from '@opnay/city-ds-react/input';
import { Select } from '@opnay/city-ds-react/select';
import { Table } from '@opnay/city-ds-react/table';

const statuses = { all: '모든 상태', active: '진행 중', completed: '완료' };
const projects = [
  { name: '공원 정비', status: 'active' },
  { name: '도로 점검', status: 'active' },
  { name: '공원 안내판 교체', status: 'completed' },
] as const;

export default function FiltersExample({
  density = 'comfortable',
}: {
  density?: 'comfortable' | 'compact';
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const results = projects.filter(
    (project) =>
      project.name.includes(query.trim()) && (status === 'all' || project.status === status),
  );

  return (
    <div className="w-full overflow-hidden rounded-city-md border border-city-border">
      <div className="border-b border-city-border px-4 py-3">
        <FilterBar
          aria-label="프로젝트 필터"
          density={density}
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setQuery('');
                setStatus('all');
              }}
            >
              초기화
            </Button>
          }
        >
          <Field.Root>
            <Field.Label className="sr-only">프로젝트 이름</Field.Label>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="프로젝트 이름 검색"
            />
          </Field.Root>
          <div className="min-w-0">
            <Select.Root
              items={statuses}
              value={status}
              onValueChange={(value) => setStatus(value ?? 'all')}
            >
              <Select.Label className="sr-only">상태</Select.Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Positioner>
                  <Select.Popup>
                    <Select.List>
                      {Object.entries(statuses).map(([value, label]) => (
                        <Select.Item key={value} value={value}>
                          <Select.ItemText>{label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.List>
                  </Select.Popup>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
          </div>
        </FilterBar>
      </div>
      <DataTableRegion label="프로젝트 목록">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>프로젝트</Table.Head>
              <Table.Head>상태</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {results.map((project) => (
              <Table.Row key={project.name}>
                <Table.Cell>{project.name}</Table.Cell>
                <Table.Cell>{statuses[project.status]}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Caption role="status">
            {results.length > 0
              ? `${results.length}개 · ${results.map((project) => project.name).join(', ')}`
              : '조건에 맞는 프로젝트가 없어요.'}
          </Table.Caption>
        </Table.Root>
      </DataTableRegion>
    </div>
  );
}
