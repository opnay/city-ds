import { Button } from '@opnay/city-ds-react/button';
import { Panel } from '@opnay/city-ds-react/panel';

export default function PanelStructureExample() {
  return (
    <div className="city-docs-example-stack">
      <Panel.Root
        aria-labelledby="panel-deployment-title"
        className="overflow-hidden rounded-city-md border border-city-border"
        data-docs-combination="actions=provided"
        render={<section />}
      >
        <Panel.Header
          actions={
            <Button size="sm" type="button" variant="ghost">
              새로고침
            </Button>
          }
          className="border-b border-city-border px-3 py-2"
        >
          <strong className="text-sm" id="panel-deployment-title">
            배포 상태
          </strong>
        </Panel.Header>
        <Panel.Body className="p-4 text-sm">프로덕션 배포가 정상입니다.</Panel.Body>
      </Panel.Root>

      <Panel.Root
        aria-labelledby="panel-activity-title"
        className="overflow-hidden rounded-city-md border border-city-border"
        data-docs-combination="actions=none"
        render={<section />}
      >
        <Panel.Header className="border-b border-city-border px-3 py-2">
          <strong className="text-sm" id="panel-activity-title">
            최근 활동
          </strong>
        </Panel.Header>
        <Panel.Body className="p-4 text-sm">최근 변경 사항이 없습니다.</Panel.Body>
      </Panel.Root>
    </div>
  );
}
