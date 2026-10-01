import '@testing-library/jest-dom/vitest';
import '@opnay/city-ds-react/styles.css';
import '../../src/styles.css';

import { cleanup } from '@testing-library/react';
import { toast } from '@opnay/city-ds-react/toast';
import { afterEach } from 'vitest';

document.documentElement.lang = 'ko';
document.title = 'city-ds Public Docs';

afterEach(() => {
  toast.dismiss();
  cleanup();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.cityDocsPreviewGrid;
  window.localStorage.clear();
});
