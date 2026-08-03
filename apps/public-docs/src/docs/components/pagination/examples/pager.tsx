import { useState } from 'react';
import { Pagination } from '@opnay/city-ds-react/pagination';

export default function PaginationExample() {
  const [page, setPage] = useState(4);

  return (
    <div className="city-docs-example-stack">
      <Pagination.Root page={page} totalPages={12} onPageChange={setPage} />
      <Pagination.Root density="compact" page={page} totalPages={12} onPageChange={setPage} />
    </div>
  );
}
