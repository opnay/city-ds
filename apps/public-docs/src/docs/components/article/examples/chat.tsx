import { Article, Commentary } from '@opnay/city-ds-react';

const response = `확인할 항목은 다음과 같습니다.

- 화면 폭에 맞춰 문장이 줄바꿈되는지 확인합니다.
- 긴 코드 블록은 본문 안에서 스크롤합니다.

> 완료된 작업과 남은 작업을 구분해 안내합니다.`;

export default function ChatExample() {
  return (
    <Commentary.Root>
      <Commentary.Header>
        <Commentary.Author>Assistant</Commentary.Author>
      </Commentary.Header>
      <Commentary.Content>
        <Article render={<div />} markdown={response} />
      </Commentary.Content>
    </Commentary.Root>
  );
}
