import { useRef, useState } from 'react';
import { Button, Stepper, type StepperRootProps } from '@opnay/city-ds-react';

const steps = [
  { title: '기본 정보', description: '프로젝트 이름과 설명을 입력하십시오.', summary: 'City Web' },
  { title: '팀원 초대', description: '함께 작업할 팀원을 선택하십시오.', summary: '팀원 2명' },
  { title: '설정 확인', description: '입력한 내용을 검토하십시오.', summary: '설정 확인 완료' },
];

export default function StepperSetupExample({
  orientation = 'horizontal',
  error = false,
}: Pick<StepperRootProps, 'orientation'> & { error?: boolean }) {
  const [step, setStep] = useState(1);
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  function move(next: number) {
    setStep(next);
    heading.current?.focus();
  }
  return (
    <div className="city-docs-stepper-example" data-orientation={orientation}>
      <Stepper.Root aria-label="프로젝트 설정 단계" orientation={orientation}>
        {steps.map((item, index) => {
          const completed = finished || index < step;
          const failed = !finished && index === step && error;
          return (
            <Stepper.Item
              key={item.title}
              current={!finished && index === step}
              status={failed ? 'error' : completed ? 'completed' : 'pending'}
              statusLabel={
                failed ? '확인 필요' : completed ? '완료' : index === step ? '진행 중' : '대기'
              }
            >
              <Stepper.Indicator>{index + 1}</Stepper.Indicator>
              <Stepper.Content>
                {!finished && index < step ? (
                  <Stepper.Trigger onClick={() => move(index)}>{item.title}</Stepper.Trigger>
                ) : (
                  <Stepper.Title>{item.title}</Stepper.Title>
                )}
                <Stepper.Description>{item.summary}</Stepper.Description>
              </Stepper.Content>
            </Stepper.Item>
          );
        })}
      </Stepper.Root>
      <div className="city-docs-stepper-body">
        <h3 ref={heading} tabIndex={-1} className="city-docs-stepper-heading">
          {finished ? '설정 완료' : steps[step]?.title}
        </h3>
        <p className="city-docs-stepper-message" role="status">
          {finished
            ? '모든 단계를 확인했습니다.'
            : error
              ? '초대할 팀원을 확인하십시오.'
              : steps[step]?.description}
        </p>
        <div className="city-docs-stepper-actions">
          {finished ? (
            <Button
              variant="outline"
              onClick={() => {
                setFinished(false);
                move(0);
              }}
            >
              다시 시작
            </Button>
          ) : (
            <>
              <Button variant="outline" disabled={step === 0} onClick={() => move(step - 1)}>
                이전
              </Button>
              <Button
                disabled={error}
                onClick={() => {
                  if (step === steps.length - 1) {
                    setFinished(true);
                    heading.current?.focus();
                    return;
                  }
                  move(step + 1);
                }}
              >
                {step === steps.length - 1 ? '완료' : '다음'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
