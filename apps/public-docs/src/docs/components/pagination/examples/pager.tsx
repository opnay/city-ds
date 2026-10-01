import { useState } from 'react';
import { Pagination } from '@opnay/city-ds-react/pagination';

export default function PaginationExample() {
  const [page, setPage] = useState(4);

  return (
    <div className="city-docs-example-stack">
      <Pagination.Root
        aria-label="기본 페이지 탐색"
        page={page}
        totalPages={12}
        onPageChange={setPage}
      />
      <Pagination.Root
        aria-label="조밀한 페이지 탐색"
        density="compact"
        page={page}
        totalPages={12}
        onPageChange={setPage}
      />
    </div>
  );
}
