import { useEffect, useRef, useState } from 'react';
import {
  Actioned,
  AgentActivity,
  Button,
  Commentary,
  type ActionedStatus,
} from '@opnay/city-ds-react';

const labels: Record<ActionedStatus, string> = {
  queued: '대기 중',
  'approval-required': '승인 필요',
  running: '실행 중',
  completed: '완료',
  failed: '실패',
  cancelled: '취소됨',
  rejected: '거절됨',
};

export default function ConversationExample() {
  const [phase, setPhase] = useState<'message' | 'thinking' | 'tool'>('message');
  const [status, setStatus] = useState<ActionedStatus>('approval-required');
  const [submissions, setSubmissions] = useState(0);
  const currentStatus = useRef<ActionedStatus>('approval-required');
  const moveFocus = useRef(false);
  const nextButton = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (phase === 'tool' ? trigger.current : nextButton.current)?.focus();
  }, [phase, status]);

  function advance(next: 'thinking' | 'tool') {
    moveFocus.current = true;
    setPhase(next);
  }

  function transition(next: ActionedStatus) {
    currentStatus.current = next;
    moveFocus.current = true;
    setStatus(next);
  }

  function approve() {
    // Guard before starting a request, including repeated clicks in the same tick.
    if (currentStatus.current !== 'approval-required') return;
    transition('running');
    setSubmissions((count) => count + 1);
  }

  return (
    <div className="grid min-w-0 gap-5">
      <p className="text-sm text-city-muted-foreground">
        상태 전환을 직접 체험하는 예제입니다. 실제 파일이나 네트워크에 접근하지 않습니다.
      </p>
      <Commentary.Root appearance="bubble" align="end">
        <Commentary.Header>
          <Commentary.Author>사용자</Commentary.Author>
        </Commentary.Header>
        <Commentary.Content>프로젝트의 README를 읽고 핵심 내용을 정리해 주세요.</Commentary.Content>
      </Commentary.Root>
      {phase === 'message' && (
        <Button
          ref={nextButton}
          size="sm"
          className="justify-self-start"
          onClick={() => advance('thinking')}
        >
          작업 시작
        </Button>
      )}
      {phase !== 'message' && (
        <AgentActivity.Root pending={phase === 'thinking'}>
          <AgentActivity.Indicator />
          <AgentActivity.Content>
            {phase === 'thinking'
              ? 'Thinking — 읽을 파일을 확인하고 있습니다.'
              : 'README.md를 확인할 준비가 되었습니다.'}
          </AgentActivity.Content>
        </AgentActivity.Root>
      )}
      {phase === 'thinking' && (
        <Button
          ref={nextButton}
          size="sm"
          className="justify-self-start"
          onClick={() => advance('tool')}
        >
          승인 요청 보기
        </Button>
      )}
      {phase === 'tool' && (
        <Actioned.Root status={status}>
          <Actioned.Header>
            <Actioned.Trigger ref={trigger}>README.md 읽기</Actioned.Trigger>
            <Actioned.Status>{labels[status]}</Actioned.Status>
          </Actioned.Header>
          <Actioned.Content>
            <pre tabIndex={0} aria-label="파일 읽기 입력">
              <code>{'{ "path": "README.md" }'}</code>
            </pre>
            {status === 'failed' && (
              <p>파일을 읽지 못했습니다. 경로를 확인하고 다시 승인해 주세요.</p>
            )}
            {status === 'completed' && (
              <p>파일 읽기 완료: React 디자인 시스템의 설치와 사용 안내입니다.</p>
            )}
          </Actioned.Content>
          {status === 'approval-required' && (
            <Actioned.Approval>
              <p>README.md 파일 읽기를 허용하시겠습니까?</p>
              <Actioned.Actions>
                <Button size="sm" onClick={approve}>
                  허용
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (currentStatus.current === 'approval-required') transition('rejected');
                  }}
                >
                  거절
                </Button>
              </Actioned.Actions>
            </Actioned.Approval>
          )}
          {status === 'running' && (
            <Actioned.Actions className="px-3 pb-3">
              <Button size="sm" variant="outline" onClick={() => transition('completed')}>
                성공 결과 적용
              </Button>
              <Button size="sm" variant="outline" onClick={() => transition('failed')}>
                실패 결과 적용
              </Button>
              <Button size="sm" variant="outline" onClick={() => transition('cancelled')}>
                실행 취소
              </Button>
            </Actioned.Actions>
          )}
          {(status === 'failed' || status === 'cancelled' || status === 'rejected') && (
            <Actioned.Actions className="px-3 pb-3">
              <Button size="sm" variant="outline" onClick={() => transition('approval-required')}>
                다시 승인 요청
              </Button>
            </Actioned.Actions>
          )}
        </Actioned.Root>
      )}
      {status === 'completed' && (
        <Commentary.Root>
          <Commentary.Header>
            <Commentary.Author>Assistant</Commentary.Author>
          </Commentary.Header>
          <Commentary.Content>
            이 프로젝트는 Base UI 기반 React 디자인 시스템이며 라이트·다크·시스템 테마를 지원합니다.
          </Commentary.Content>
        </Commentary.Root>
      )}
      <p className="text-xs text-city-muted-foreground">실행 요청: {submissions}회</p>
      {/* Announce only current progress, without re-reading the transcript. */}
      <span className="sr-only" role="status" aria-atomic="true">
        {phase === 'thinking' ? 'Thinking' : phase === 'tool' ? labels[status] : ''}
      </span>
    </div>
  );
}
