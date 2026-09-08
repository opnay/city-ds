import { useId, type ReactNode } from 'react';
import { Panel, type PanelRootProps } from '@opnay/city-ds-react/panel';
import './blocks.css';

interface BlockCardProps extends Omit<PanelRootProps, 'title' | 'children'> {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  titleAs?: 'h3' | 'h4' | 'span';
  children?: ReactNode;
}

export function BlockCard({
  title,
  description,
  actions,
  titleAs: Heading = 'h3',
  children,
  className,
  render,
  ...props
}: BlockCardProps) {
  const titleId = useId();
  return (
    <Panel.Root
      {...props}
      render={render ?? <section />}
      aria-labelledby={titleId}
      data-appearance="outline"
      className={`city-block-form city-block-card ${className ?? ''}`}
    >
      <Panel.Header actions={actions} className="city-block-card-header">
        <div className="city-block-card-heading">
          <Heading
            id={titleId}
            className={
              Heading === 'span'
                ? 'city-block-section-title'
                : Heading === 'h4'
                  ? 'city-block-step-title'
                  : 'city-text-subsection-title'
            }
          >
            {title}
          </Heading>
          {description && (
            <p className="city-text-supporting city-block-card-description">{description}</p>
          )}
        </div>
      </Panel.Header>
      {children != null && children !== false && (
        <Panel.Body className="city-block-card-body">{children}</Panel.Body>
      )}
    </Panel.Root>
  );
}
