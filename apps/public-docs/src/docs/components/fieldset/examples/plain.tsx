import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { Fieldset } from '@opnay/city-ds-react/fieldset';

const channels = ['이메일', '문자', '푸시'] as const;

export default function FieldsetPlainExample() {
  return (
    <Fieldset.Root appearance="plain">
      <Fieldset.Legend>알림 채널</Fieldset.Legend>
      <Fieldset.Content className="city-docs-fieldset-options-3">
        {channels.map((channel) => {
          const id = `fieldset-plain-${channel}`;
          return (
            <div className="city-docs-example-row" key={channel}>
              <Checkbox aria-labelledby={id} defaultChecked={channel === '이메일'} />
              <span id={id}>{channel}</span>
            </div>
          );
        })}
      </Fieldset.Content>
    </Fieldset.Root>
  );
}
