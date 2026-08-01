import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const colorTokens = [
  ['--city-color-background', '페이지 배경'],
  ['--city-color-foreground', '기본 텍스트와 아이콘'],
  ['--city-color-surface', '구획과 카드 배경'],
  ['--city-color-surface-raised', '떠 있는 표면'],
  ['--city-color-muted', '보조 배경'],
  ['--city-color-muted-foreground', '보조 텍스트'],
  ['--city-color-accent', '상호작용 배경'],
  ['--city-color-accent-hover', '상호작용 hover'],
  ['--city-color-accent-active', '상호작용 active'],
  ['--city-color-accent-foreground', '상호작용 배경 위 콘텐츠'],
  ['--city-color-border', '일반 경계선'],
  ['--city-color-input', '입력 경계선'],
  ['--city-color-ring', '포커스 표시'],
  ['--city-color-primary', '주요 액션'],
  ['--city-color-primary-foreground', '주요 액션 위 콘텐츠'],
  ['--city-color-destructive', '위험 액션과 오류'],
  ['--city-color-destructive-foreground', '위험 액션 위 콘텐츠'],
  ['--city-color-warning', '주의 상태'],
  ['--city-color-success', '성공 상태'],
  ['--city-color-info', '정보 상태'],
] as const;

const spacingTokens = [
  ['--city-space-0', '0px'],
  ['--city-space-0-5', '2px'],
  ['--city-space-1', '4px'],
  ['--city-space-1-5', '6px'],
  ['--city-space-2', '8px'],
  ['--city-space-2-5', '10px'],
  ['--city-space-3', '12px'],
  ['--city-space-3-5', '14px'],
  ['--city-space-4', '16px'],
  ['--city-space-5', '20px'],
  ['--city-space-6', '24px'],
  ['--city-space-8', '32px'],
  ['--city-space-10', '40px'],
  ['--city-space-12', '48px'],
  ['--city-space-16', '64px'],
] as const;

const typeTokens = [
  ['2xs', '조밀한 상태와 그룹 레이블'],
  ['xs', '작은 컨트롤과 보조 설명'],
  ['sm', '컴포넌트와 본문 기본 크기'],
  ['md', '강조 본문과 작은 제목'],
  ['lg', '섹션 제목'],
] as const;

const radiusTokens = ['xs', 'sm', 'md', 'lg', 'full'] as const;
const shadowTokens = ['sm', 'panel', 'popup'] as const;
const durationTokens = [
  ['fast', '100ms'],
  ['normal', '150ms'],
  ['slow', '250ms'],
] as const;
const easingTokens = ['standard', 'enter', 'exit'] as const;
const controlTokens = [
  ['sm', '32px'],
  ['md', '36px'],
  ['lg', '40px'],
] as const;

interface TokenStoryFrameProps {
  children: ReactNode;
  description: string;
  title: string;
}

function TokenStoryFrame({ children, description, title }: TokenStoryFrameProps) {
  return (
    <section className="city-token-story">
      <header className="city-token-story-header">
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
      {children}
    </section>
  );
}

const meta = {
  title: '기초/디자인 토큰',
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
    layout: 'padded',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  name: '색상',
  render: () => (
    <TokenStoryFrame
      description="용도 중심의 의미 토큰입니다. 테마를 바꾸면 모든 색상 미리보기가 함께 바뀝니다."
      title="색상"
    >
      <div className="city-token-color-grid">
        {colorTokens.map(([name, description]) => (
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
    </TokenStoryFrame>
  ),
};

export const Spacing: Story = {
  name: '간격',
  render: () => (
    <TokenStoryFrame
      description="4px 기본 단위에서 파생된 간격 단계입니다. 숫자형 Tailwind 간격도 같은 단위를 사용합니다."
      title="간격"
    >
      <div className="city-token-scale">
        {spacingTokens.map(([name, value]) => (
          <div className="city-token-scale-row" key={name}>
            <code>{name}</code>
            <div className="city-token-space-track">
              <span className="city-token-space-bar" style={{ width: `var(${name})` }} />
            </div>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </TokenStoryFrame>
  ),
};

export const Typography: Story = {
  name: '타이포그래피',
  render: () => (
    <TokenStoryFrame
      description="외부 폰트 요청 없이 동작하는 시스템 글꼴, 크기, 행간과 굵기 기준입니다."
      title="타이포그래피"
    >
      <div className="city-token-type-list">
        {typeTokens.map(([size, description]) => (
          <div className="city-token-type-row" key={size}>
            <p
              style={{
                fontSize: `var(--city-font-size-${size})`,
                lineHeight: `var(--city-line-height-${size})`,
              }}
            >
              다람쥐 헌 쳇바퀴에 타고파 0123
            </p>
            <code>{`--city-font-size-${size}`}</code>
            <span>{description}</span>
          </div>
        ))}
      </div>
      <dl className="city-token-definition-list">
        <div>
          <dt>
            <code>--city-font-family-sans</code>
          </dt>
          <dd>인터페이스와 본문용 시스템 sans-serif</dd>
        </div>
        <div>
          <dt>
            <code>--city-font-family-mono</code>
          </dt>
          <dd>코드와 고정폭 숫자용 monospace</dd>
        </div>
        <div>
          <dt>
            <code>--city-font-weight-regular / medium / semibold</code>
          </dt>
          <dd>400 / 500 / 600</dd>
        </div>
      </dl>
    </TokenStoryFrame>
  ),
};

export const Radius: Story = {
  render: () => (
    <TokenStoryFrame
      description="표면과 컨트롤의 모서리 형태를 일관되게 유지하는 단계입니다."
      title="Radius"
    >
      <div className="city-token-preview-grid">
        {radiusTokens.map((name) => (
          <div
            className="city-token-radius-card"
            key={name}
            style={{ borderRadius: `var(--city-radius-${name})` }}
          >
            <code>{`--city-radius-${name}`}</code>
          </div>
        ))}
      </div>
    </TokenStoryFrame>
  ),
};

export const Shadows: Story = {
  name: '그림자',
  render: () => (
    <TokenStoryFrame
      description="컨트롤, 패널과 팝업의 높이감을 표현하며 테마별 명암을 사용합니다."
      title="그림자"
    >
      <div className="city-token-preview-grid">
        {shadowTokens.map((name) => (
          <div
            className="city-token-shadow-card"
            key={name}
            style={{ boxShadow: `var(--city-shadow-${name})` }}
          >
            <code>{`--city-shadow-${name}`}</code>
          </div>
        ))}
      </div>
    </TokenStoryFrame>
  ),
};

export const Motion: Story = {
  name: '모션',
  render: () => (
    <TokenStoryFrame
      description="행에 포인터를 올려 duration과 easing의 차이를 확인할 수 있습니다."
      title="모션"
    >
      <div className="city-token-motion-list">
        {durationTokens.map(([name, value]) => (
          <div className="city-token-motion-row" key={name}>
            <code>{`--city-duration-${name}`}</code>
            <div className="city-token-motion-track">
              <span
                className="city-token-motion-dot"
                style={{
                  transitionDuration: `var(--city-duration-${name})`,
                  transitionTimingFunction: 'var(--city-easing-standard)',
                }}
              />
            </div>
            <span>{value}</span>
          </div>
        ))}
        {easingTokens.map((name) => (
          <div className="city-token-motion-row" key={name}>
            <code>{`--city-easing-${name}`}</code>
            <div className="city-token-motion-track">
              <span
                className="city-token-motion-dot"
                style={{
                  transitionDuration: 'var(--city-duration-slow)',
                  transitionTimingFunction: `var(--city-easing-${name})`,
                }}
              />
            </div>
            <span>easing</span>
          </div>
        ))}
      </div>
    </TokenStoryFrame>
  ),
};

export const ControlSizes: Story = {
  name: '컨트롤 크기',
  render: () => (
    <TokenStoryFrame
      description="버튼과 입력 등 상호작용 요소가 공유하는 세로 크기 기준입니다."
      title="컨트롤 크기"
    >
      <div className="city-token-control-list">
        {controlTokens.map(([name, value]) => (
          <div className="city-token-control-row" key={name}>
            <div
              className="city-token-control-preview"
              style={{ height: `var(--city-control-${name})` }}
            >
              {name}
            </div>
            <code>{`--city-control-${name}`}</code>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </TokenStoryFrame>
  ),
};
