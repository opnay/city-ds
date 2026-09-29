import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Alert,
  Avatar,
  Button,
  Commentary,
  EmptyState,
  Field,
  Skeleton,
  Textarea,
} from '@opnay/city-ds-react';
import { Copy, Send } from 'lucide-react';
import { AiChatBlockCard } from './ai-chat-block-card';

export interface SupportMessage {
  id: string;
  author: { name: string; initials: string; model?: string };
  content: ReactNode;
  role: 'customer' | 'support';
  sentAt: string;
}

export interface SupportConversationData {
  id: string;
  customer: { name: string; initials: string };
  messages: readonly SupportMessage[];
  subject: string;
}

export interface SupportConversationProps {
  conversation?: SupportConversationData;
  error?: string;
  loading?: boolean;
  onMessageAction?: ((message: SupportMessage, action: 'copy') => void) | undefined;
  onRetry?: (() => void) | undefined;
  onBackToList?: (() => void) | undefined;
  onSendMessage?:
    | ((message: { conversationId: string; content: string }) => Promise<void>)
    | undefined;
  sendPending?: boolean;
}

function messageTime(sentAt: string) {
  return new Date(sentAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
  });
}

export function SupportConversation({
  conversation,
  error,
  loading = false,
  onMessageAction,
  onRetry,
  onBackToList,
  onSendMessage,
  sendPending = false,
}: SupportConversationProps) {
  const [draft, setDraft] = useState('');
  const [localPending, setLocalPending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const sending = useRef(false);
  const previousConversationId = useRef(conversation?.id);
  const activeConversationId = useRef(conversation?.id);
  const busy = sendPending || localPending;

  useEffect(() => {
    activeConversationId.current = conversation?.id;
    if (previousConversationId.current === conversation?.id) return;
    previousConversationId.current = conversation?.id;
    setDraft('');
    setSendError('');
    setSentMessage('');
  }, [conversation?.id]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!conversation || !onSendMessage || !content || sending.current || busy) return;
    const conversationId = conversation.id;
    sending.current = true;
    setLocalPending(true);
    setSendError('');
    setSentMessage('');
    try {
      await onSendMessage({ conversationId, content });
      if (activeConversationId.current === conversationId) {
        setDraft('');
        setSentMessage('답변을 보냈습니다.');
      }
    } catch {
      if (activeConversationId.current === conversationId) {
        setSendError('답변을 보내지 못했습니다. 연결을 확인한 뒤 다시 시도하십시오.');
      }
    } finally {
      sending.current = false;
      setLocalPending(false);
    }
  }

  if (loading && !conversation) {
    return (
      <AiChatBlockCard title="고객 지원 대화">
        <div
          role="status"
          aria-label="고객 지원 대화 불러오는 중"
          aria-busy="true"
          className="city-ai-chat-block-transcript"
        >
          <Skeleton className="h-12 w-2/3 justify-self-end" />
          <Skeleton className="h-20 w-4/5" />
          <Skeleton className="h-20 w-full" />
        </div>
      </AiChatBlockCard>
    );
  }

  if (error && !conversation) {
    return (
      <AiChatBlockCard title="고객 지원 대화">
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>대화를 불러오지 못했습니다.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
          {onRetry && <Button onClick={onRetry}>다시 불러오기</Button>}
        </Alert.Root>
      </AiChatBlockCard>
    );
  }

  if (!conversation) {
    return (
      <AiChatBlockCard title="고객 지원 대화">
        <EmptyState.Root>
          <EmptyState.Title level={4}>선택한 고객 문의가 없습니다.</EmptyState.Title>
          <EmptyState.Description>
            목록에서 문의를 선택하면 대화와 답변 입력창을 표시합니다.
          </EmptyState.Description>
        </EmptyState.Root>
      </AiChatBlockCard>
    );
  }

  return (
    <AiChatBlockCard
      title={conversation.subject}
      description={`${conversation.customer.name} 고객과 주고받은 지원 대화입니다.`}
      actions={
        onBackToList && (
          <Button variant="outline" onClick={onBackToList}>
            문의 목록으로
          </Button>
        )
      }
    >
      {error && (
        <Alert.Root tone="destructive">
          <Alert.Title level={4}>대화를 새로고침하지 못했습니다.</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
          {onRetry && <Button onClick={onRetry}>다시 불러오기</Button>}
        </Alert.Root>
      )}
      <div className="city-ai-chat-block-transcript" aria-label="고객 지원 대화">
        {conversation.messages.map((message) => (
          <Commentary.Root
            key={message.id}
            appearance={message.role === 'customer' ? 'bubble' : 'plain'}
            align={message.role === 'customer' ? 'end' : 'start'}
          >
            <Commentary.Header>
              <Avatar.Root aria-label={message.author.name} size="sm">
                <Avatar.Fallback>{message.author.initials}</Avatar.Fallback>
              </Avatar.Root>
              <Commentary.Author>{message.author.name}</Commentary.Author>
              {message.author.model && <Commentary.Meta>{message.author.model}</Commentary.Meta>}
              <Commentary.Meta render={<time dateTime={message.sentAt} />}>
                {messageTime(message.sentAt)}
              </Commentary.Meta>
            </Commentary.Header>
            <Commentary.Content>{message.content}</Commentary.Content>
            {message.role === 'support' && onMessageAction && (
              <Commentary.Actions>
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={`${message.author.name} 답변 복사`}
                  onClick={() => onMessageAction(message, 'copy')}
                >
                  <Copy aria-hidden="true" size={14} />
                  답변 복사
                </Button>
              </Commentary.Actions>
            )}
          </Commentary.Root>
        ))}
      </div>
      {onSendMessage && (
        <form className="city-ai-chat-block-composer" onSubmit={sendMessage}>
          <Field.Root>
            <Field.Label>답변</Field.Label>
            <Textarea
              value={draft}
              placeholder="고객에게 보낼 답변을 입력하십시오."
              disabled={busy}
              onChange={(event) => setDraft(event.currentTarget.value)}
            />
          </Field.Root>
          {sendError && (
            <p role="alert" className="city-ai-chat-block-error">
              {sendError}
            </p>
          )}
          {sentMessage && (
            <p role="status" className="city-block-status">
              {sentMessage}
            </p>
          )}
          <div className="city-ai-chat-block-actions">
            <Button type="submit" disabled={busy || !draft.trim()}>
              <Send aria-hidden="true" size={16} />
              {busy ? '보내는 중…' : '답변 보내기'}
            </Button>
          </div>
        </form>
      )}
    </AiChatBlockCard>
  );
}

const exampleConversation: SupportConversationData = {
  id: 'support_1024',
  customer: { name: '김서윤', initials: '서윤' },
  subject: '만료된 팀 초대 링크',
  messages: [
    {
      id: 'message_1',
      author: { name: '김서윤', initials: '서윤' },
      content: '팀원 초대 메일을 다시 보낼 수 있나요? 초대 링크가 만료된 것 같습니다.',
      role: 'customer',
      sentAt: '2026-09-17T09:41:00+09:00',
    },
    {
      id: 'message_2',
      author: { name: 'City 지원팀', initials: 'CS', model: 'support-model-2026-09' },
      content: (
        <>
          네. 팀 설정의 초대 대기 목록에서 해당 팀원을 선택한 뒤 <strong>초대 다시 보내기</strong>를
          누르십시오. 새 링크를 보내면 이전 링크는 사용할 수 없습니다.
        </>
      ),
      role: 'support',
      sentAt: '2026-09-17T09:43:00+09:00',
    },
  ],
};

export default function SupportConversationExample() {
  const [messages, setMessages] = useState(exampleConversation.messages);
  const [showList, setShowList] = useState(false);
  const listButton = useRef<HTMLElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const navigated = useRef(false);

  useEffect(() => {
    if (!navigated.current) return;
    if (showList) listButton.current?.focus();
    else detail.current?.focus();
  }, [showList]);

  if (showList) {
    return (
      <AiChatBlockCard title="고객 문의" description="답변할 문의를 선택하십시오.">
        <Button ref={listButton} variant="outline" onClick={() => setShowList(false)}>
          {exampleConversation.subject}
        </Button>
      </AiChatBlockCard>
    );
  }

  return (
    <div ref={detail} tabIndex={-1}>
      <SupportConversation
        conversation={{ ...exampleConversation, messages }}
        onBackToList={() => {
          navigated.current = true;
          setShowList(true);
        }}
        onSendMessage={async ({ content }) => {
          setMessages((current) => [
            ...current,
            {
              id: `message_${current.length + 1}`,
              author: { name: 'City 지원팀', initials: 'CS', model: 'support-model-2026-09' },
              content,
              role: 'support',
              sentAt: '2026-09-17T09:45:00+09:00',
            },
          ]);
        }}
      />
    </div>
  );
}
