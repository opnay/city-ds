import { useState } from 'react';
import { DensityProvider } from '@opnay/city-ds-react/density-provider';
import { Pagination } from '@opnay/city-ds-react/pagination';

function DensitySample({ density }: { density: 'comfortable' | 'compact' }) {
  const [page, setPage] = useState(2);

  return (
    <DensityProvider density={density}>
      <Pagination.Root
        aria-label={`${density} 페이지 이동`}
        onPageChange={setPage}
        page={page}
        totalPages={5}
      />
    </DensityProvider>
  );
}

export default function DensityProviderExample() {
  return (
    <div className="city-docs-example-stack">
      <DensitySample density="comfortable" />
      <DensitySample density="compact" />
    </div>
  );
}
