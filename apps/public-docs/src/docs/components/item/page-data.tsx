import ItemContentExample from './examples/content';
import contentSource from './examples/content.tsx?raw';
import ItemLinksExample from './examples/links';
import linksSource from './examples/links.tsx?raw';
import ItemMediaExample from './examples/media';
import mediaSource from './examples/media.tsx?raw';
import type { PreviewOptionProps } from '../../preview-playgrounds/types';
import type { ComponentPageData } from '../../types';

function ItemPreview({ appearance, density }: PreviewOptionProps) {
  return (
    <ItemContentExample
      appearance={appearance === 'outline' ? 'outline' : appearance === 'band' ? 'band' : 'plain'}
      density={density === 'compact' ? 'compact' : 'comfortable'}
    />
  );
}

export const pageData = {
  featuredExampleId: 'item-preview',
  widePreviewIds: ['item-preview', 'item-links', 'item-media'],
  api: [
    {
      name: 'Item.Root',
      type: 'div props + render',
      description: '콘텐츠와 액션을 묶는 행입니다. Group 안에서는 li로 감쌉니다.',
    },
    {
      name: 'appearance',
      type: "'plain' | 'band' | 'outline'",
      defaultValue: "'plain'",
      description: '배경과 외곽 경계의 표현입니다.',
    },
    {
      name: 'density',
      type: "'comfortable' | 'compact'",
      description: '행의 padding과 gap입니다. 생략하면 DensityProvider를 따릅니다.',
    },
    {
      name: 'className',
      type: 'string | (state: ItemState) => string',
      description: 'Root는 appearance와 density를 className 및 render 콜백에 제공합니다.',
    },
    {
      name: 'Item.Group',
      type: 'ul props + render',
      description: '관련 콘텐츠 행의 목록입니다. Root와 Separator를 자식으로 배치하십시오.',
    },
    {
      name: 'Item.Separator',
      type: 'Divider props',
      description: '장식용 가로 구분선입니다. 그룹 안에서는 보조 기술에서 숨겨진 li로 감쌉니다.',
    },
    {
      name: 'Item.Media',
      type: 'div props + render',
      description: '아이콘·이미지·Avatar 영역입니다.',
    },
    {
      name: 'Item.Media variant',
      type: "'default' | 'icon' | 'image'",
      defaultValue: "'default'",
      description: 'icon은 SVG 크기를, image는 밀도별 이미지 크기와 object-cover를 적용합니다.',
    },
    {
      name: 'Item.Content',
      type: 'div props + render',
      description: '남은 폭을 사용하는 제목·설명 영역입니다.',
    },
    {
      name: 'Item.Title',
      type: 'div props + render',
      description: '콘텐츠 제목입니다. heading이 필요하면 render로 합성하십시오.',
    },
    {
      name: 'Item.Description',
      type: 'p props + render',
      description: '여러 줄로 표시하는 보조 설명입니다.',
    },
    {
      name: 'Item.Actions',
      type: 'div props + render',
      description: '끝에 정렬하며 좁은 화면에서 줄바꿈하는 액션 영역입니다.',
    },
    {
      name: 'Item.Header / Item.Footer',
      type: 'div props + render',
      description: '행 위·아래의 전체 폭 영역입니다.',
    },
  ],
  optionAxes: [
    {
      name: 'appearance',
      control: 'segmented',
      defaultValue: 'plain',
      values: ['plain', 'band', 'outline'],
    },
    {
      name: 'density',
      control: 'segmented',
      defaultValue: 'comfortable',
      values: ['comfortable', 'compact'],
    },
  ],
  examples: [
    {
      id: 'item-preview',
      title: 'Preview',
      description: '콘텐츠와 저장 액션을 묶고 표면과 밀도를 조절합니다.',
      Component: ItemPreview,
      configurable: true,
      filename: 'content.tsx',
      source: contentSource,
      coverage: [
        { axis: 'appearance', values: ['plain', 'band', 'outline'] },
        { axis: 'density', values: ['comfortable', 'compact'] },
        { axis: 'media', values: ['icon'] },
      ],
    },
    {
      id: 'item-links',
      title: '링크 목록',
      description: '행 전체를 링크로 합성하고 목록의 의미와 구분선을 유지합니다.',
      Component: ItemLinksExample,
      filename: 'links.tsx',
      source: linksSource,
      coverage: [{ axis: 'composition', values: ['group', 'separator', 'link'] }],
    },
    {
      id: 'item-media',
      title: '미디어와 전체 폭 영역',
      description: 'Avatar·이미지와 Header·Footer를 조합합니다.',
      Component: ItemMediaExample,
      filename: 'media.tsx',
      source: mediaSource,
      coverage: [
        { axis: 'media', values: ['avatar', 'image'] },
        { axis: 'composition', values: ['header', 'footer'] },
      ],
    },
  ],
} satisfies ComponentPageData;
