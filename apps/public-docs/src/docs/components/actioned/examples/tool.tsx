import { Actioned, Button, type ActionedRootProps } from '@opnay/city-ds-react';

export default function ToolExample({
  status,
  density = 'comfortable',
  defaultOpen = false,
}: Pick<ActionedRootProps, 'status' | 'density' | 'defaultOpen'>) {
  return (
    <Actioned.Root status={status} density={density} defaultOpen={defaultOpen}>
      <Actioned.Header>
        <Actioned.Trigger>프로젝트 파일 읽기</Actioned.Trigger>
        <Actioned.Status />
      </Actioned.Header>
      <Actioned.Content>
        <pre tabIndex={0} aria-label="도구 입력">
          <code>{'{ "path": "packages/react/src/components/commentary/index.tsx" }'}</code>
        </pre>
        <p>
          {status === 'failed'
            ? '파일을 읽지 못했습니다. 경로와 접근 권한을 확인하십시오.'
            : '도구 입력과 결과는 소비자가 구성합니다.'}
        </p>
      </Actioned.Content>
      {status === 'approval-required' && (
        <Actioned.Approval>
          <p>
            승인 영역은 상세가 닫혀 있어도 표시됩니다. 아래 버튼은 배치 예시이며 실제 동작은 대화
            흐름 예제에서 확인할 수 있습니다.
          </p>
          <Actioned.Actions>
            <Button size="sm" disabled>
              허용
            </Button>
            <Button size="sm" variant="outline" disabled>
              거절
            </Button>
          </Actioned.Actions>
        </Actioned.Approval>
      )}
    </Actioned.Root>
  );
}
