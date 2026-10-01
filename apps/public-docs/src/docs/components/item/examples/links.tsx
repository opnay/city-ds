import { ChevronRightIcon } from 'lucide-react';
import { Item } from '@opnay/city-ds-react/item';

export default function ItemLinksExample() {
  return (
    <Item.Group aria-label="참고 문서">
      <Item.Root render={<a href="/getting-started" />}>
        <Item.Content>
          <Item.Title>시작하기</Item.Title>
          <Item.Description>설치와 테마 연결 방법을 확인합니다.</Item.Description>
        </Item.Content>
        <ChevronRightIcon className="size-4 shrink-0" aria-hidden="true" />
      </Item.Root>
      <Item.Separator />
      <Item.Root render={<a href="/accessibility" />}>
        <Item.Content>
          <Item.Title>접근성</Item.Title>
          <Item.Description>키보드와 보조 기술의 점검 기준을 확인합니다.</Item.Description>
        </Item.Content>
        <ChevronRightIcon className="size-4 shrink-0" aria-hidden="true" />
      </Item.Root>
    </Item.Group>
  );
}
