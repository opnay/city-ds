import { useRef, useState } from 'react';
import { Button, DataList, Field, Input, Textarea } from '@opnay/city-ds-react';
import { BlockCard } from './block-card';

export interface ProjectSettingsValues {
  id: string;
  name: string;
  description: string;
}
export function ProjectSettings({
  initialProject,
  onSave,
  canManage = true,
}: {
  initialProject: ProjectSettingsValues;
  onSave: (project: ProjectSettingsValues) => Promise<void>;
  canManage?: boolean;
}) {
  const [saved, setSaved] = useState(initialProject);
  const [draft, setDraft] = useState(initialProject);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const pending = useRef(false);
  const dirty = draft.name !== saved.name || draft.description !== saved.description;
  return (
    <BlockCard
      title="프로젝트 설정"
      description="프로젝트를 식별하는 이름과 설명을 관리하십시오."
      render={<form />}
      onSubmit={async (event) => {
        event.preventDefault();
        if (!canManage || pending.current || !dirty) return;
        setMessage('');
        if (!draft.name.trim()) {
          setError('프로젝트 이름을 입력하십시오.');
          return;
        }
        const next = { ...draft, name: draft.name.trim() };
        pending.current = true;
        setBusy(true);
        setError('');
        try {
          await onSave(next);
          setSaved(next);
          setDraft(next);
          setMessage('변경 사항을 저장했습니다.');
        } catch {
          setError('저장하지 못했습니다. 입력을 유지한 채 다시 시도할 수 있습니다.');
        } finally {
          pending.current = false;
          setBusy(false);
        }
      }}
    >
      <DataList.Root aria-label="프로젝트 식별 정보" orientation="vertical">
        <DataList.Item>
          <DataList.Label>프로젝트 ID</DataList.Label>
          <DataList.Value>
            <div className="city-block-split">
              <code>{saved.id}</code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(saved.id);
                    setMessage('프로젝트 ID를 복사했습니다.');
                  } catch {
                    setMessage('복사하지 못했습니다. 프로젝트 ID를 직접 선택해 복사하십시오.');
                  }
                }}
              >
                ID 복사
              </Button>
            </div>
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
      {!canManage && <p className="city-block-status">프로젝트 설정을 변경할 권한이 없습니다.</p>}
      <Field.Root disabled={busy || !canManage} invalid={!!error && !draft.name.trim()}>
        <Field.Label>프로젝트 이름</Field.Label>
        <Input
          required
          maxLength={60}
          value={draft.name}
          onChange={(event) => {
            setDraft({ ...draft, name: event.target.value });
            setError('');
            setMessage('');
          }}
        />
      </Field.Root>
      <Field.Root disabled={busy || !canManage}>
        <Field.Label>프로젝트 설명</Field.Label>
        <Textarea
          maxLength={300}
          rows={3}
          value={draft.description}
          onChange={(event) => {
            setDraft({ ...draft, description: event.target.value });
            setError('');
            setMessage('');
          }}
        />
        <Field.Description>프로젝트의 목적을 300자 이내로 작성하십시오.</Field.Description>
      </Field.Root>
      {error && (
        <p role="alert" className="city-block-project-error">
          {error}
        </p>
      )}
      <p role="status" className="city-block-status">
        {message}
      </p>
      <div className="city-block-actions">
        <Button
          type="button"
          variant="outline"
          disabled={!dirty || busy || !canManage}
          onClick={() => {
            setDraft(saved);
            setError('');
            setMessage('');
          }}
        >
          취소
        </Button>
        <Button type="submit" disabled={!dirty || busy || !canManage}>
          {busy ? '저장 중…' : '변경 저장'}
        </Button>
      </div>
    </BlockCard>
  );
}
export default function ProjectSettingsExample({
  mode = 'edit',
}: { mode?: 'edit' | 'read-only' } = {}) {
  return (
    <ProjectSettings
      canManage={mode !== 'read-only'}
      initialProject={{
        id: 'prj_city_web',
        name: 'City Web',
        description: '팀의 웹 서비스를 운영합니다.',
      }}
      onSave={async () => {}}
    />
  );
}
