import { Accordion } from '@opnay/city-ds-react/accordion';

export default function AccordionSelectionExample() {
  return (
    <div className="city-docs-example-stack">
      <Accordion.Root defaultValue={['overview']}>
        <Accordion.Item value="overview">
          <Accordion.Header>
            <Accordion.Trigger>개요</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>한 항목만 열 수 있습니다.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="owner">
          <Accordion.Header>
            <Accordion.Trigger>담당자</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>플랫폼 팀에서 관리합니다.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
      <Accordion.Root defaultValue={['scope', 'owner']} multiple>
        <Accordion.Item value="scope">
          <Accordion.Header>
            <Accordion.Trigger>공개 범위</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>여러 항목을 동시에 열 수 있습니다.</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="owner">
          <Accordion.Header>
            <Accordion.Trigger>담당자</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>플랫폼 팀에서 관리합니다.</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
}
