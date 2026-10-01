import { useState } from 'react';
import { FileTextIcon } from 'lucide-react';
import { Button } from '@opnay/city-ds-react/button';
import { Item, type ItemRootProps } from '@opnay/city-ds-react/item';

export default function ItemContentExample(props: Pick<ItemRootProps, 'appearance' | 'density'>) {
  const [saved, setSaved] = useState(false);

  return (
    <Item.Root {...props} className="w-full">
      <Item.Media variant="icon">
        <FileTextIcon aria-hidden="true" />
      </Item.Media>
      <Item.Content>
        <Item.Title>프로젝트 가이드</Item.Title>
        <Item.Description>팀에서 사용하는 작업 기준과 참고 자료입니다.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button size="sm" aria-pressed={saved} onClick={() => setSaved(!saved)}>
          {saved ? '저장됨' : '저장'}
        </Button>
      </Item.Actions>
    </Item.Root>
  );
}
