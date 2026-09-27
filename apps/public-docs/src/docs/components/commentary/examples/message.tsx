import {
  Article,
  Avatar,
  Button,
  Commentary,
  type CommentaryRootProps,
} from '@opnay/city-ds-react';

const response = `본문에는 문단, 목록, 코드 등 필요한 내용을 조합합니다.

- 긴 문구는 화면 너비에 맞게 줄바꿈합니다.
- 목록의 마커와 들여쓰기를 유지합니다.

\`\`\`sh
pnpm add @opnay/city-ds-react @base-ui/react lucide-react
\`\`\``;

export default function MessageExample({
  appearance = 'plain',
  align = 'start',
  density = 'comfortable',
}: Pick<CommentaryRootProps, 'appearance' | 'align' | 'density'>) {
  return (
    <Commentary.Root appearance={appearance} align={align} density={density}>
      <Commentary.Header>
        <Avatar.Root size="sm">
          <Avatar.Fallback>AI</Avatar.Fallback>
        </Avatar.Root>
        <Commentary.Author>Assistant</Commentary.Author>
        <Commentary.Meta>research-model-2026-09-long-context</Commentary.Meta>
        <Commentary.Meta render={<time dateTime="2026-09-17T09:30:00+09:00" />}>
          09:30
        </Commentary.Meta>
      </Commentary.Header>
      <Commentary.Content>
        <Article render={<div />} markdown={response} />
      </Commentary.Content>
      <Commentary.Actions>
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={<a href="/accessibility" />}
        >
          접근성 안내
        </Button>
      </Commentary.Actions>
    </Commentary.Root>
  );
}
