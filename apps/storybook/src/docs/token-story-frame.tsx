import type { ReactNode } from 'react';

export interface TokenStoryFrameProps {
  children: ReactNode;
  description: string;
  title: string;
}

export function TokenStoryFrame({ children, description, title }: TokenStoryFrameProps) {
  return (
    <section className="city-token-story">
      <header className="city-token-story-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </section>
  );
}
