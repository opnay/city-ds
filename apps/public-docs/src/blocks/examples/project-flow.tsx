import { useEffect, useRef, type ReactNode } from 'react';
import { Stepper } from '@opnay/city-ds-react/stepper';
import './blocks.css';

export interface ProjectStep {
  title: string;
  description: string;
  summary?: string;
}

export function ProjectFlow({
  steps,
  step,
  done,
  busy,
  error,
  onBack,
  children,
}: {
  steps: readonly ProjectStep[];
  step: number;
  done: boolean;
  busy: boolean;
  error: string;
  onBack: (step: number) => void;
  children: ReactNode;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) heading.current?.focus();
    mounted.current = true;
  }, [step, done]);
  return (
    <div className="city-block-project-flow">
      <Stepper.Root orientation="vertical" aria-label="작업 단계">
        {steps.map((item, index) => (
          <Stepper.Item
            key={item.title}
            current={!done && index === step}
            status={
              done || index < step ? 'completed' : index === step && error ? 'error' : 'pending'
            }
            statusLabel={
              done || index < step
                ? '완료'
                : index === step
                  ? error
                    ? '확인 필요'
                    : '진행 중'
                  : '대기'
            }
          >
            <Stepper.Indicator>{index + 1}</Stepper.Indicator>
            <Stepper.Content>
              {!done && index < step ? (
                <Stepper.Trigger disabled={busy} onClick={() => onBack(index)}>
                  {item.title}
                </Stepper.Trigger>
              ) : (
                <Stepper.Title>{item.title}</Stepper.Title>
              )}
              <Stepper.Description>{item.summary}</Stepper.Description>
            </Stepper.Content>
          </Stepper.Item>
        ))}
      </Stepper.Root>
      <div className="city-block-project-content" aria-busy={busy}>
        <h4 ref={heading} tabIndex={-1} className="city-block-step-title">
          {done ? '완료' : steps[step]?.title}
        </h4>
        {!done && <p className="city-block-status">{steps[step]?.description}</p>}
        {error && (
          <p role="alert" className="city-block-project-error">
            {error}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
