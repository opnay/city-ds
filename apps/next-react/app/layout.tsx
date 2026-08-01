import type { Metadata } from 'next';
import '@opnay/city-ds-react/styles.css';

import './smoke.css';

export const metadata: Metadata = {
  title: 'city-ds · Next.js',
  description: 'city-ds Next.js consumer smoke test',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
