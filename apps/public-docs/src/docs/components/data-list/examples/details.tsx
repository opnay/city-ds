import { useState } from 'react';
import { Badge } from '@opnay/city-ds-react/badge';
import { Button } from '@opnay/city-ds-react/button';
import { DataList, type DataListRootProps } from '@opnay/city-ds-react/data-list';

export default function DataListDetailsExample(
  props: Pick<DataListRootProps, 'orientation' | 'density' | 'dividers'>,
) {
  const [visible, setVisible] = useState(false);
  return (
    <DataList.Root {...props} aria-label="연결 정보" className="w-full">
      <DataList.Item>
        <DataList.Label>앱 이름</DataList.Label>
        <DataList.Value>일정 도우미</DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>상태</DataList.Label>
        <DataList.Value>
          <Badge appearance="subtle">연결됨</Badge>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>허용한 권한</DataList.Label>
        <DataList.Value>
          <ul className="m-0" style={{ listStyle: 'disc inside', padding: 0 }}>
            <li>기본 프로필 읽기</li>
            <li>일정 읽기 및 작성</li>
          </ul>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>연결 식별자</DataList.Label>
        <DataList.Value>
          <div className="flex flex-wrap items-start gap-2">
            <code className="min-w-0 flex-1">
              {visible ? 'connection_0123456789abcdefghijklmnopqrstuvwxyz' : 'connection_••••••••'}
            </code>
            <Button
              size="sm"
              variant="outline"
              aria-pressed={visible}
              onClick={() => setVisible(!visible)}
            >
              {visible ? '숨기기' : '보기'}
            </Button>
          </div>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>최근 사용</DataList.Label>
        <DataList.Value>
          <time dateTime="2026-09-08T09:30:00+09:00">2026. 9. 8. 09:30 KST</time>
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  );
}
