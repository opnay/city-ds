import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokenStoryFrame } from '../docs/token-story-frame';

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
  ['xs', '캡션과 작은 컨트롤'],
  ['sm', '보조 설명과 컴포넌트'],
  ['md', '본문 기본 크기'],
  ['lg', '도입 문단'],
  ['xl', '하위 섹션 제목'],
  ['2xl', '섹션 제목'],
  ['3xl', '작은 페이지 제목'],
  ['4xl', '큰 페이지 제목'],
  ['5xl', '대표 메시지'],
] as const;

const radiusTokens = ['xs', 'sm', 'md', 'lg', 'full'] as const;
const shadowTokens = ['sm', 'panel', 'popup'] as const;
const durationTokens = [
  ['xfast', '80ms'],
  ['fast', '120ms'],
  ['normal', '160ms'],
  ['slow', '240ms'],
] as const;
const easingTokens = ['standard', 'enter', 'exit'] as const;
const controlTokens = [
  ['xsm', '24px'],
  ['sm', '28px'],
  ['md', '32px'],
  ['lg', '36px'],
  ['xlg', '40px'],
] as const;

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
