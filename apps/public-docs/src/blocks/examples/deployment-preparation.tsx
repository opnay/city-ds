import { useRef, useState } from 'react';
import { Button, Checkbox, DataList, RadioGroup } from '@opnay/city-ds-react';
import { BlockCard } from './block-card';
import { ProjectFlow } from './project-flow';

export interface DeploymentTarget {
  environment: 'staging' | 'production';
  revision: string;
}
export interface CreatedDeployment {
  id: string;
}
const steps = [
  { title: '환경 선택', description: '배포 대상을 선택합니다.' },
  { title: '설정 검증', description: '배포 조건을 확인합니다.' },
  { title: '변경 확인', description: '대상과 버전을 검토합니다.' },
  { title: '배포', description: '검증한 버전을 적용합니다.' },
];

export function DeploymentPreparation({
  revision,
  onValidate,
  onDeploy,
  onViewDeployment,
}: {
  revision: string;
  onValidate: (target: DeploymentTarget) => Promise<void>;
  onDeploy: (target: DeploymentTarget) => Promise<CreatedDeployment>;
  onViewDeployment: (id: string) => void;
}) {
  const [environment, setEnvironment] = useState<DeploymentTarget['environment']>('staging');
  const [step, setStep] = useState(0);
  const [validated, setValidated] = useState<DeploymentTarget | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deployed, setDeployed] = useState<(DeploymentTarget & CreatedDeployment) | null>(null);
  const done = deployed !== null;
  const [error, setError] = useState('');
  const pending = useRef(false);
  const valid = validated?.environment === environment && validated?.revision === revision;
  function back(next: number) {
    if (pending.current || next >= step) return;
    setError('');
    setConfirmed(false);
    if (next < 2) setValidated(null);
    setStep(next);
  }
  async function advance() {
    if (pending.current || done) return;
    setError('');
    if (step === 0) {
      setStep(1);
      return;
    }
    if (step === 2) {
      if (valid && confirmed) setStep(3);
      return;
    }
    if (step === 3 && (!valid || !confirmed)) return;
    const target = { environment, revision };
    pending.current = true;
    setBusy(true);
    try {
      if (step === 1) {
        await onValidate(target);
        setValidated(target);
        setStep(2);
      } else {
        const result = await onDeploy(target);
        setDeployed({ ...target, id: result.id });
      }
    } catch {
      setError(
        step === 1
          ? '설정을 검증하지 못했습니다. 환경과 권한을 확인한 뒤 다시 시도하십시오.'
          : '배포하지 못했습니다. 선택한 환경과 버전은 유지됩니다. 다시 시도하십시오.',
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <BlockCard
      title="배포 준비"
      description="환경과 변경 사항을 확인한 뒤 배포하십시오."
      className="city-block-project"
    >
      <ProjectFlow
        steps={steps.map((item, index) => ({
          ...item,
          summary:
            [
              environment === 'production' ? '운영' : '스테이징',
              `${validated?.revision ?? revision} 검증 완료`,
              `${validated?.revision ?? revision} 검토 완료`,
              `${deployed?.revision ?? revision} 배포 완료`,
            ][index] ?? '',
        }))}
        step={step}
        done={done}
        busy={busy}
        error={error}
        onBack={back}
      >
        {done ? (
          <div className="city-block-section">
            <p role="status">
              {deployed.environment === 'production' ? '운영' : '스테이징'} 환경에{' '}
              {deployed.revision} 배포를 완료했습니다.
            </p>
            <Button onClick={() => onViewDeployment(deployed.id)}>실행 상세 보기</Button>
          </div>
        ) : (
          <>
            {step === 0 && (
              <RadioGroup
                aria-label="배포 환경"
                value={environment}
                onValueChange={(value) => {
                  if (value !== 'staging' && value !== 'production') return;
                  setEnvironment(value);
                  setValidated(null);
                  setConfirmed(false);
                }}
              >
                <label className="city-block-project-choice">
                  <RadioGroup.Control value="staging" />
                  스테이징
                </label>
                <label className="city-block-project-choice">
                  <RadioGroup.Control value="production" />
                  운영
                </label>
              </RadioGroup>
            )}
            {step === 1 && <p>선택한 환경의 설정과 배포 권한을 검증합니다.</p>}
            {step >= 2 && (
              <>
                <DataList.Root orientation="vertical" aria-label="배포 대상">
                  <DataList.Item>
                    <DataList.Label>환경</DataList.Label>
                    <DataList.Value>
                      {environment === 'production' ? '운영' : '스테이징'}
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label>버전</DataList.Label>
                    <DataList.Value>{revision}</DataList.Value>
                  </DataList.Item>
                </DataList.Root>
                {!valid && (
                  <p role="alert">
                    대상이 변경되었습니다. 설정 검증 단계로 돌아가 다시 검증하십시오.
                  </p>
                )}
              </>
            )}
            {step === 2 && (
              <label className="city-block-project-choice">
                <Checkbox checked={confirmed} onCheckedChange={setConfirmed} />
                배포 대상과 변경 사항을 확인했습니다.
              </label>
            )}
            {step === 3 && <p>배포 중에는 단계를 이동할 수 없습니다.</p>}
            <div className="city-block-actions">
              {step > 0 && (
                <Button variant="outline" disabled={busy} onClick={() => back(step - 1)}>
                  이전
                </Button>
              )}
              <Button disabled={busy || (step >= 2 && (!valid || !confirmed))} onClick={advance}>
                {busy
                  ? step === 1
                    ? '검증 중…'
                    : '배포 중…'
                  : step === 0
                    ? '다음'
                    : step === 1
                      ? '설정 검증'
                      : step === 2
                        ? '배포 단계로'
                        : '배포 시작'}
              </Button>
            </div>
          </>
        )}
      </ProjectFlow>
    </BlockCard>
  );
}

export default function DeploymentPreparationExample() {
  const [viewedId, setViewedId] = useState<string | null>(null);

  if (viewedId) {
    return (
      <BlockCard title="실행 상세" description="완료된 배포 실행입니다.">
        <p>실행 ID: {viewedId}</p>
      </BlockCard>
    );
  }

  return (
    <DeploymentPreparation
      revision="v1.2.0"
      onValidate={async () => {}}
      onDeploy={async () => ({ id: 'sample-deployment' })}
      onViewDeployment={setViewedId}
    />
  );
}
