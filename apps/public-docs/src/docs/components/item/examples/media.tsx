import { Avatar } from '@opnay/city-ds-react/avatar';
import { Badge } from '@opnay/city-ds-react/badge';
import { Item } from '@opnay/city-ds-react/item';

export default function ItemMediaExample() {
  return (
    <Item.Group aria-label="팀 콘텐츠">
      <Item.Root appearance="outline">
        <Item.Media>
          <Avatar.Root>
            <Avatar.Fallback>MC</Avatar.Fallback>
          </Avatar.Root>
        </Item.Media>
        <Item.Content>
          <Item.Title>Maya Chen</Item.Title>
          <Item.Description>제품 디자인 · 팀 관리자</Item.Description>
        </Item.Content>
        <Item.Actions>
          <Badge appearance="subtle">활성</Badge>
        </Item.Actions>
      </Item.Root>
      <Item.Root appearance="outline">
        <Item.Header>
          <span className="text-xs text-city-muted-foreground">프로필 사진</span>
          <Badge appearance="outline">검토 중</Badge>
        </Item.Header>
        <Item.Media variant="image">
          <img src="/avatars/riley-brooks.webp" alt="Riley Brooks의 프로필 사진" />
        </Item.Media>
        <Item.Content>
          <Item.Title>팀 디렉터리에 사용할 프로필 사진</Item.Title>
          <Item.Description>긴 제목과 설명은 생략하지 않고 여러 줄로 표시합니다.</Item.Description>
        </Item.Content>
        <Item.Footer>
          <span className="text-xs text-city-muted-foreground">오늘 추가됨</span>
        </Item.Footer>
      </Item.Root>
    </Item.Group>
  );
}
