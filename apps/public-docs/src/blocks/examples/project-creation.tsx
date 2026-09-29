import { useRef, useState } from 'react';
import { Button, DataList, Field, Input } from '@opnay/city-ds-react';
import { BlockCard } from './block-card';
import { ProjectFlow } from './project-flow';

export interface ProjectDraft {
  name: string;
  email: string;
}
export interface CreatedProject {
  id: string;
}
const steps = [
  { title: '기본 정보', description: '프로젝트 이름을 정합니다.' },
  { title: '팀원 초대', description: '함께할 팀원을 초대합니다.' },
  { title: '설정 확인', description: '입력한 내용을 검토합니다.' },
];

export function ProjectCreation({
  onCreate,
  onViewProject,
}: {
  onCreate: (draft: ProjectDraft) => Promise<CreatedProject>;
  onViewProject: (id: string) => void;
}) {
  const [draft, setDraft] = useState<ProjectDraft>({ name: '', email: '' });
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [createdProject, setCreatedProject] = useState<CreatedProject | null>(null);
  const done = createdProject !== null;
  const [error, setError] = useState('');
  const pending = useRef(false);
  function back(next: number) {
    if (pending.current || next >= step) return;
    setError('');
    setStep(next);
  }
  return (
    <BlockCard
      title="새 프로젝트"
      description="프로젝트를 만들고 팀원을 초대하십시오."
      className="city-block-project"
      render={<form />}
      onSubmit={async (event) => {
        event.preventDefault();
        if (pending.current || done) return;
        if (!draft.name.trim()) {
          setError('프로젝트 이름을 입력하십시오.');
          return;
        }
        setError('');
        if (step < 2) {
          setStep(step + 1);
          return;
        }
        pending.current = true;
        setBusy(true);
        try {
          const project = await onCreate({ name: draft.name.trim(), email: draft.email.trim() });
          setCreatedProject(project);
        } catch {
          setError('프로젝트를 만들지 못했습니다. 입력한 내용은 유지됩니다. 다시 시도하십시오.');
        } finally {
          pending.current = false;
          setBusy(false);
        }
      }}
    >
      <ProjectFlow
        steps={steps.map((item, index) => ({
          ...item,
          summary:
            [draft.name.trim(), draft.email.trim() || '초대하지 않음', '생성 완료'][index] ?? '',
        }))}
        step={step}
        done={done}
        busy={busy}
        error={error}
        onBack={back}
      >
        {done ? (
          <div className="city-block-section">
            <p role="status">{draft.name.trim()} 프로젝트를 만들었습니다.</p>
            <Button type="button" onClick={() => onViewProject(createdProject.id)}>
              프로젝트 상세 보기
            </Button>
          </div>
        ) : (
          <>
            {step === 0 && (
              <Field.Root disabled={busy}>
                <Field.Label>프로젝트 이름</Field.Label>
                <Input
                  required
                  maxLength={60}
                  value={draft.name}
                  onChange={(event) => {
                    setDraft({ ...draft, name: event.target.value });
                    setError('');
                  }}
                />
                <Field.Description>팀에서 알아보기 쉬운 이름을 입력하십시오.</Field.Description>
              </Field.Root>
            )}
            {step === 1 && (
              <Field.Root disabled={busy}>
                <Field.Label>초대 이메일</Field.Label>
                <Input
                  type="email"
                  value={draft.email}
                  onChange={(event) => {
                    setDraft({ ...draft, email: event.target.value });
                    setError('');
                  }}
                />
                <Field.Description>
                  선택 사항입니다. 팀원은 나중에도 초대할 수 있습니다.
                </Field.Description>
              </Field.Root>
            )}
            {step === 2 && (
              <DataList.Root orientation="vertical" aria-label="프로젝트 정보">
                <DataList.Item>
                  <DataList.Label>프로젝트 이름</DataList.Label>
                  <DataList.Value>{draft.name.trim()}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>초대 이메일</DataList.Label>
                  <DataList.Value>{draft.email.trim() || '초대하지 않음'}</DataList.Value>
                </DataList.Item>
              </DataList.Root>
            )}
            <div className="city-block-actions">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() => back(step - 1)}
                >
                  이전
                </Button>
              )}
              <Button type="submit" disabled={busy}>
                {busy ? '생성 중…' : step === 2 ? '프로젝트 만들기' : '다음'}
              </Button>
            </div>
          </>
        )}
      </ProjectFlow>
    </BlockCard>
  );
}

export default function ProjectCreationExample() {
  const [project, setProject] = useState<{ id: string; name: string } | null>(null);
  const [viewed, setViewed] = useState(false);

  if (viewed && project) {
    return (
      <BlockCard title={project.name} description="새 프로젝트의 상세 화면입니다.">
        <p>프로젝트 ID: {project.id}</p>
      </BlockCard>
    );
  }

  return (
    <ProjectCreation
      onCreate={async (draft) => {
        const created = { id: 'sample-project', name: draft.name };
        setProject(created);
        return created;
      }}
      onViewProject={() => setViewed(true)}
    />
  );
}
