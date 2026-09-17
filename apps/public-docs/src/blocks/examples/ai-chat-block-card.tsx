import { useId, type ReactNode } from 'react';
import { Panel, type PanelRootProps } from '@opnay/city-ds-react/panel';
import './ai-chat-blocks.css';

interface AiChatBlockCardProps extends Omit<PanelRootProps, 'title' | 'children'> {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

export function AiChatBlockCard({
  title,
  description,
  actions,
  children,
  className,
  render,
  ...props
}: AiChatBlockCardProps) {
  const titleId = useId();
  return (
    <Panel.Root
      {...props}
      render={render ?? <section />}
      aria-labelledby={titleId}
      className={`city-ai-chat-block ${className ?? ''}`}
    >
      <Panel.Header actions={actions} className="city-ai-chat-block-header">
        <div className="city-ai-chat-block-heading">
          <h3 id={titleId} className="city-text-subsection-title">
            {title}
          </h3>
          {description && <p className="city-text-supporting">{description}</p>}
        </div>
      </Panel.Header>
      {children != null && children !== false && (
        <Panel.Body className="city-ai-chat-block-body">{children}</Panel.Body>
      )}
    </Panel.Root>
  );
}
