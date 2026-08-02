import { useState } from 'react';
import { Tabs } from '@opnay/city-ds-react/tabs';
function Panels() {
  return (
    <>
      <Tabs.List>
        <Tabs.Tab value="overview">개요</Tabs.Tab>
        <Tabs.Tab value="activity">활동</Tabs.Tab>
        <Tabs.Tab disabled value="settings">
          설정
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">프로젝트 개요입니다.</Tabs.Panel>
      <Tabs.Panel value="activity">최근 활동입니다.</Tabs.Panel>
      <Tabs.Panel value="settings">설정</Tabs.Panel>
    </>
  );
}
export default function TabsExample() {
  const [value, setValue] = useState('overview');
  return (
    <div className="city-docs-example-stack">
      <Tabs.Root density="comfortable" onValueChange={setValue} value={value}>
        <Panels />
      </Tabs.Root>
      <Tabs.Root defaultValue="activity" density="compact">
        <Panels />
      </Tabs.Root>
    </div>
  );
}
