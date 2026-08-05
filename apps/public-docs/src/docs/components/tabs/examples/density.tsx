import { Tabs } from '@opnay/city-ds-react/tabs';

const densities = ['comfortable', 'compact'] as const;

export default function TabsDensityExample() {
  return (
    <div className="city-docs-example-stack">
      {densities.map((density) => (
        <Tabs.Root defaultValue="overview" density={density} key={density}>
          <Tabs.List>
            <Tabs.Tab value="overview">개요</Tabs.Tab>
            <Tabs.Tab value="activity">활동</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">{density} 밀도입니다.</Tabs.Panel>
          <Tabs.Panel value="activity">최근 활동입니다.</Tabs.Panel>
        </Tabs.Root>
      ))}
    </div>
  );
}
