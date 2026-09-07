import { useId } from 'react';
import { SelectionCard } from '@opnay/city-ds-react/selection-card';
import { Switch } from '@opnay/city-ds-react/switch';

const settings = [
  {
    value: 'backup',
    title: '자동 백업',
    description: '매일 데이터를 안전하게 보관합니다.',
    defaultChecked: true,
  },
  {
    value: 'notifications',
    title: '활동 알림',
    description: '팀의 새로운 활동을 알림으로 받습니다.',
  },
  {
    value: 'security',
    title: '보안 알림',
    description: '조직에서 관리하는 필수 설정입니다.',
    defaultChecked: true,
    disabled: true,
  },
];

export default function SettingsExample({ disabled = false }: { disabled?: boolean }) {
  const id = useId();

  return (
    <div
      role="group"
      aria-label="워크스페이스 설정"
      className="city-docs-example-grid city-docs-example-matrix"
    >
      {settings.map((setting) => (
        <SelectionCard key={setting.value}>
          <SelectionCard.Content>
            <SelectionCard.Title id={`${id}-${setting.value}-title`}>
              {setting.title}
            </SelectionCard.Title>
            <SelectionCard.Description id={`${id}-${setting.value}-description`}>
              {setting.description}
            </SelectionCard.Description>
          </SelectionCard.Content>
          <Switch
            name={setting.value}
            defaultChecked={setting.defaultChecked}
            disabled={disabled || setting.disabled}
            aria-labelledby={`${id}-${setting.value}-title`}
            aria-describedby={`${id}-${setting.value}-description`}
            className="mt-1"
          />
        </SelectionCard>
      ))}
    </div>
  );
}
