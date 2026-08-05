import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { Fieldset } from '@opnay/city-ds-react/fieldset';

const appearances = ['plain', 'band', 'outline'] as const;
const labels = ['이메일', '문자', '푸시'] as const;

export default function FieldsetAppearancesExample() {
  return (
    <div className="city-docs-example-stack">
      {appearances.map((appearance, index) => (
        <Fieldset.Root appearance={appearance} key={appearance}>
          <Fieldset.Legend>{appearance} 알림 채널</Fieldset.Legend>
          <Fieldset.Content>
            <div className="city-docs-example-row">
              <Checkbox
                aria-labelledby={`fieldset-${appearance}-label`}
                defaultChecked={index === 0}
              />
              <span id={`fieldset-${appearance}-label`}>{labels[index]}</span>
            </div>
          </Fieldset.Content>
        </Fieldset.Root>
      ))}
    </div>
  );
}
