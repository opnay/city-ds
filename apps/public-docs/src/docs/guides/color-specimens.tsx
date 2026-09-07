import { Badge } from '@opnay/city-ds-react/badge';
import { DataTableRegion } from '@opnay/city-ds-react/data-table-region';
import { Table } from '@opnay/city-ds-react/table';

const paletteFamilies = ['neutral', 'blue', 'green', 'amber', 'red'] as const;
const paletteSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const feedbackTones = [
  ['neutral', '일반'],
  ['info', '정보'],
  ['success', '성공'],
  ['warning', '경고'],
  ['destructive', '위험'],
] as const;
const feedbackAppearances = ['solid', 'subtle', 'outline'] as const;
const themeTokens = [
  ['--city-color-background', 'Canvas'],
  ['--city-color-surface', 'Surface'],
  ['--city-color-surface-raised', 'Raised'],
  ['--city-color-muted', 'Muted'],
  ['--city-color-primary', 'Primary'],
  ['--city-color-info', 'Info'],
  ['--city-color-success', 'Success'],
  ['--city-color-warning', 'Warning'],
  ['--city-color-destructive', 'Destructive'],
] as const;

function PaletteScale({ family }: { family: (typeof paletteFamilies)[number] }) {
  return (
    <section aria-labelledby={`palette-${family}`} className="city-docs-color-family">
      <h3 className="city-text-subsection-title" id={`palette-${family}`}>
        {family}
      </h3>
      <div
        aria-label={`${family} 팔레트 단계`}
        className="city-docs-color-scale-scroll"
        role="region"
        tabIndex={0}
      >
        <div className="city-docs-color-scale">
          {paletteSteps.map((step) => {
            const token = `--city-palette-${family}-${step}`;

            return (
              <div className="city-docs-color-palette-item" key={token}>
                <span
                  aria-label={`${family} ${step} 색상`}
                  className="city-docs-color-palette-swatch"
                  role="img"
                  style={{ background: `var(${token})` }}
                />
                <code>{step}</code>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ColorPalette() {
  return (
    <div className="city-docs-color-palette">
      <section aria-labelledby="palette-absolute" className="city-docs-color-family">
        <h3 className="city-text-subsection-title" id="palette-absolute">
          absolute
        </h3>
        <div className="city-docs-color-absolute-scale">
          {['white', 'black'].map((name) => {
            const token = `--city-palette-${name}`;

            return (
              <div className="city-docs-color-palette-item" key={token}>
                <span
                  aria-label={`${name} 색상`}
                  className="city-docs-color-palette-swatch"
                  role="img"
                  style={{ background: `var(${token})` }}
                />
                <code>{name}</code>
              </div>
            );
          })}
        </div>
      </section>
      {paletteFamilies.map((family) => (
        <PaletteScale family={family} key={family} />
      ))}
    </div>
  );
}

function ThemePanel({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <section
      aria-labelledby={`color-theme-${theme}`}
      className="city-docs-color-theme-panel"
      data-theme={theme}
    >
      <header className="city-docs-color-theme-heading">
        <h3 className="city-text-subsection-title" id={`color-theme-${theme}`}>
          {theme}
        </h3>
        <code>{`data-theme="${theme}"`}</code>
      </header>
      <div className="city-docs-color-token-grid">
        {themeTokens.map(([token, label]) => (
          <div className="city-docs-color-token-item" key={token}>
            <span
              aria-label={`${theme} ${label} 색상`}
              className="city-docs-color-token-swatch"
              role="img"
              style={{ background: `var(${token})` }}
            />
            <span>
              <strong>{label}</strong>
              <code>{token}</code>
            </span>
          </div>
        ))}
      </div>
      <div className="city-docs-color-solid-group">
        <h4>Solid feedback</h4>
        <div>
          {feedbackTones.slice(1).map(([tone, label]) => (
            <Badge appearance="solid" key={tone} tone={tone}>
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ColorThemeComparison() {
  return (
    <section aria-label="Light와 Dark 의미 색상 비교" className="city-docs-color-theme-grid">
      <ThemePanel theme="light" />
      <ThemePanel theme="dark" />
    </section>
  );
}

export function FeedbackAppearanceMatrix() {
  return (
    <DataTableRegion
      className="city-docs-color-matrix-region"
      label="Feedback tone과 appearance 비교"
    >
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.Head>Tone</Table.Head>
            {feedbackAppearances.map((appearance) => (
              <Table.Head key={appearance}>{appearance}</Table.Head>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {feedbackTones.map(([tone, label]) => (
            <Table.Row key={tone}>
              <Table.Head scope="row">{tone}</Table.Head>
              {feedbackAppearances.map((appearance) => (
                <Table.Cell key={appearance}>
                  <Badge appearance={appearance} tone={tone}>
                    {label}
                  </Badge>
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </DataTableRegion>
  );
}
