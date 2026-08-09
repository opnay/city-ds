import type { Meta, StoryObj } from '@storybook/react-vite';

import { Alert, Badge, Button } from '@opnay/city-ds-react';
import { TokenStoryFrame } from '../docs/token-story-frame';

const paletteFamilies = ['neutral', 'blue', 'green', 'amber', 'red'] as const;
const paletteSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

const semanticGroups = [
  {
    title: 'Canvas와 콘텐츠',
    tokens: [
      ['--city-color-background', '페이지 배경'],
      ['--city-color-foreground', '기본 텍스트와 아이콘'],
      ['--city-color-muted-foreground', '보조 텍스트'],
      ['--city-color-inverse', '역상 표면'],
      ['--city-color-inverse-foreground', '역상 표면 위 콘텐츠'],
    ],
  },
  {
    title: 'Surface와 상호작용',
    tokens: [
      ['--city-color-surface', '페이지 안의 기능 구획'],
      ['--city-color-surface-raised', '떠 있는 표면'],
      ['--city-color-muted', '보조 배경'],
      ['--city-color-accent', '상호작용 기본 배경'],
      ['--city-color-accent-hover', '상호작용 hover'],
      ['--city-color-accent-active', '상호작용 active'],
      ['--city-color-border', '일반 경계선'],
      ['--city-color-input', '입력 경계선'],
      ['--city-color-ring', '포커스 표시'],
    ],
  },
  {
    title: '주요 액션과 위험 액션',
    tokens: [
      ['--city-color-primary', '주요 액션 fill'],
      ['--city-color-primary-hover', '주요 액션 hover'],
      ['--city-color-primary-active', '주요 액션 active'],
      ['--city-color-primary-foreground', '주요 액션 위 콘텐츠'],
      ['--city-color-destructive', '위험 액션과 오류 표시'],
      ['--city-color-destructive-hover', '위험 액션 hover'],
      ['--city-color-destructive-active', '위험 액션 active'],
      ['--city-color-destructive-foreground', '위험 액션 위 콘텐츠'],
      ['--city-color-destructive-surface', '오류 subtle surface'],
      ['--city-color-destructive-border', '오류 경계선'],
    ],
  },
  {
    title: '피드백',
    tokens: ['info', 'success', 'warning'].flatMap((tone) => [
      [`--city-color-${tone}`, `${tone} indicator와 solid fill`],
      [`--city-color-${tone}-foreground`, `${tone} solid 위 콘텐츠`],
      [`--city-color-${tone}-surface`, `${tone} subtle surface`],
      [`--city-color-${tone}-border`, `${tone} 경계선`],
    ]),
  },
  {
    title: '효과',
    tokens: [
      ['--city-color-backdrop', 'Modal backdrop'],
      ['--city-color-backdrop-subtle', '비차단 backdrop'],
      ['--city-color-shimmer', 'Skeleton highlight'],
    ],
  },
] as const;

const feedbackTones = ['info', 'success', 'warning', 'destructive'] as const;

const meta = {
  title: '기초/디자인 토큰/색상',
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function PaletteFamily({ family }: { family: (typeof paletteFamilies)[number] }) {
  return (
    <section aria-labelledby={`city-palette-${family}`} className="city-palette-family">
      <h2 id={`city-palette-${family}`}>{family}</h2>
      <div className="city-palette-scale">
        {paletteSteps.map((step) => {
          const token = `--city-palette-${family}-${step}`;

          return (
            <div className="city-palette-step" key={token}>
              <span
                aria-label={`${family} ${step} 색상`}
                className="city-palette-swatch"
                role="img"
                style={{ background: `var(${token})` }}
              />
              <code>{step}</code>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SemanticTokens({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <section className="city-color-theme-panel" data-theme={theme}>
      <header>
        <h2>{theme}</h2>
        <code>{`data-theme="${theme}"`}</code>
      </header>
      {semanticGroups.map((group) => (
        <section className="city-semantic-color-group" key={group.title}>
          <h3>{group.title}</h3>
          <div className="city-token-color-grid">
            {group.tokens.map(([name, description]) => (
              <div className="city-token-color-card" key={name}>
                <div
                  aria-label={`${description} 색상 미리보기`}
                  className="city-token-color-swatch"
                  role="img"
                  style={{ background: `var(${name})` }}
                />
                <code>{name}</code>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}

function ComponentColors({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <section className="city-color-theme-panel city-color-component-panel" data-theme={theme}>
      <header>
        <h2>{theme}</h2>
        <code>{`data-theme="${theme}"`}</code>
      </header>
      <div className="city-color-component-group">
        <h3>Action</h3>
        <div className="flex flex-wrap gap-2">
          <Button>변경 저장</Button>
          <Button variant="secondary">미리보기</Button>
          <Button variant="outline">취소</Button>
          <Button variant="destructive">프로젝트 삭제</Button>
        </div>
      </div>
      <div className="city-color-component-group">
        <h3>Strong feedback</h3>
        <div className="flex flex-wrap gap-2">
          {feedbackTones.map((tone) => (
            <Badge appearance="solid" key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
        </div>
      </div>
      <div className="city-color-component-group">
        <h3>Subtle feedback</h3>
        <div className="grid gap-2">
          {feedbackTones.map((tone) => (
            <Alert.Root key={tone} tone={tone}>
              <Alert.Title>{tone} 상태</Alert.Title>
              <Alert.Description>아이콘과 문구가 색상 의미를 함께 전달합니다.</Alert.Description>
            </Alert.Root>
          ))}
        </div>
      </div>
    </section>
  );
}

export const Palette: Story = {
  name: '원시 팔레트',
  render: () => (
    <TokenStoryFrame
      description="Tailwind v4 OKLCH 값을 저장소에 고정한 원시 재료입니다. 컴포넌트에는 직접 사용하지 않고 의미 토큰을 정의할 때 사용합니다."
      title="원시 팔레트"
    >
      <div className="city-palette-groups">
        <section aria-labelledby="city-palette-absolute" className="city-palette-family">
          <h2 id="city-palette-absolute">absolute</h2>
          <div className="city-palette-scale city-palette-scale-absolute">
            {['white', 'black'].map((name) => {
              const token = `--city-palette-${name}`;

              return (
                <div className="city-palette-step" key={token}>
                  <span
                    aria-label={`${name} 색상`}
                    className="city-palette-swatch"
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
          <PaletteFamily family={family} key={family} />
        ))}
      </div>
    </TokenStoryFrame>
  ),
};

export const Semantic: Story = {
  name: '의미 토큰',
  render: () => (
    <TokenStoryFrame
      description="역할은 유지하고 실제 팔레트 단계만 테마별로 바뀝니다. Light와 Dark를 함께 비교하십시오."
      title="의미 색상"
    >
      <div className="city-color-theme-grid">
        <SemanticTokens theme="light" />
        <SemanticTokens theme="dark" />
      </div>
    </TokenStoryFrame>
  ),
};

export const ComponentContrast: Story = {
  name: '컴포넌트 대비',
  render: () => (
    <TokenStoryFrame
      description="동일한 컴포넌트 계약을 Light와 Dark에 동시에 렌더링합니다. 이 표본은 Storybook 접근성 검사 대상입니다."
      title="컴포넌트 색상 대비"
    >
      <div className="city-color-theme-grid">
        <ComponentColors theme="light" />
        <ComponentColors theme="dark" />
      </div>
    </TokenStoryFrame>
  ),
};
