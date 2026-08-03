import { useState } from 'react';
import { Accordion } from '@opnay/city-ds-react/accordion';

export default function AccordionUsageExample() {
  const [value, setValue] = useState(['status']);

  return (
    <div className="city-docs-example-stack">
      <Accordion.Root defaultValue={['overview']}>
        <Accordion.Item value="overview">
          <Accordion.Header>
            <Accordion.Trigger>개요</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>서비스의 공개 범위와 담당자를 확인합니다.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item disabled value="policy">
          <Accordion.Header>
            <Accordion.Trigger>조직 정책</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>권한이 필요합니다.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
      <Accordion.Root defaultValue={['scope', 'owner']} multiple>
        <Accordion.Item value="scope">
          <Accordion.Header>
            <Accordion.Trigger>공개 범위</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>여러 섹션을 동시에 열 수 있습니다.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="owner">
          <Accordion.Header>
            <Accordion.Trigger>담당자</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>플랫폼 팀에서 관리합니다.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
      <Accordion.Root onValueChange={(nextValue) => setValue(nextValue as string[])} value={value}>
        <Accordion.Item value="status">
          <Accordion.Header>
            <Accordion.Trigger>제어된 상태</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>외부 상태와 열린 항목을 동기화합니다.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="history">
          <Accordion.Header>
            <Accordion.Trigger>변경 이력</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>사용자가 항목을 전환할 수 있습니다.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
      <Accordion.Root defaultValue={['locked']} disabled>
        <Accordion.Item value="locked">
          <Accordion.Header>
            <Accordion.Trigger>전체 비활성</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Root에서 모든 항목의 상호작용을 막습니다.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
