import playgroundSource from './examples/playground.tsx?raw';
import Playground from './examples/playground';
import verificationSource from './examples/verification.tsx?raw';
import VerificationExample from './examples/verification';
import groupedSource from './examples/grouped.tsx?raw';
import GroupedExample from './examples/grouped';
import sizesSource from './examples/sizes.tsx?raw';
import SizesExample from './examples/sizes';
import { isEnabled, toControlSize, type PreviewOptionProps } from '../../preview-playgrounds/types';
import type { ComponentPageData } from '../../types';

function OtpInputPreview({
  length,
  size,
  validationType,
  mask,
  disabled,
  readOnly,
  invalid,
}: PreviewOptionProps) {
  return (
    <Playground
      length={length === '4' ? 4 : length === '8' ? 8 : 6}
      size={toControlSize(size)}
      validationType={validationType === 'alphanumeric' ? 'alphanumeric' : 'numeric'}
      mask={isEnabled(mask)}
      disabled={isEnabled(disabled)}
      readOnly={isEnabled(readOnly)}
      invalid={isEnabled(invalid)}
    />
  );
}

export const pageData = {
  featuredExampleId: 'otp-input-playground',
  api: [
    {
      name: 'OtpInput.Root',
      type: 'OTPField.Root props + size',
      description: '입력 값과 슬롯을 관리합니다. 자식을 생략하면 length만큼 Input을 생성합니다.',
    },
    {
      name: 'length',
      type: 'number',
      defaultValue: '6',
      description: '인증 코드의 자리 수입니다. 양의 정수를 사용하십시오.',
    },
    {
      name: 'value / defaultValue / onValueChange',
      type: 'string / string / callback',
      description: '코드의 앞자리 0을 보존하는 문자열 값입니다.',
    },
    {
      name: 'onValueComplete',
      type: '(value, eventDetails) => void',
      description:
        '모든 자리가 입력되면 호출합니다. 코드 검증과 후속 요청은 소비 프로젝트에서 처리하십시오.',
    },
    {
      name: 'validationType',
      type: "'numeric' | 'alpha' | 'alphanumeric' | 'none'",
      defaultValue: "'numeric'",
      description:
        '입력 가능한 문자를 지정합니다. normalizeValue로 추가 정규화를 적용할 수 있습니다.',
    },
    {
      name: 'mask / disabled / readOnly',
      type: 'boolean',
      defaultValue: 'false',
      description: '문자 가림, 비활성, 읽기 전용 상태를 지정합니다.',
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg' | 'xlg'",
      defaultValue: "'md'",
      description: '슬롯 크기를 지정하고 Input에 상속합니다.',
    },
    {
      name: 'name / required / autoComplete',
      type: 'native form props',
      description: '폼 값과 필수 여부를 연결합니다. autoComplete 기본값은 one-time-code입니다.',
    },
    {
      name: 'autoSubmit',
      type: 'boolean',
      defaultValue: 'false',
      description: '명시적으로 켜면 코드 완성 시 소유 form을 제출합니다.',
    },
    {
      name: 'OtpInput.Input',
      type: 'OTPField.Input props + size',
      description: '명시적으로 배치할 슬롯입니다. Input 개수를 Root length와 맞추십시오.',
    },
  ],
  examples: [
    {
      Component: OtpInputPreview,
      configurable: true,
      coverage: [
        { axis: 'length', values: ['4', '6', '8'] },
        { axis: 'validationType', values: ['numeric', 'alphanumeric'] },
        { axis: 'mask', values: ['false', 'true'] },
        { axis: 'disabled', values: ['false', 'true'] },
        { axis: 'readOnly', values: ['false', 'true'] },
        { axis: 'invalid', values: ['false', 'true'] },
      ],
      description: '자리 수, 문자 종류와 입력 상태를 바꿔 확인합니다.',
      id: 'otp-input-playground',
      filename: 'playground.tsx',
      source: playgroundSource,
      title: 'Preview',
    },
    {
      Component: VerificationExample,
      coverage: [{ axis: 'mode', values: ['controlled'] }],
      description: '코드는 문자열로 관리하고 확인 동작은 소비 form에서 처리합니다.',
      id: 'otp-input-verification',
      filename: 'verification.tsx',
      source: verificationSource,
      title: '폼 입력',
    },
    {
      Component: GroupedExample,
      coverage: [{ axis: 'composition', values: ['grouped'] }],
      description: 'Input 사이에 시각적 구분 기호를 넣고 영문을 대문자로 정규화합니다.',
      id: 'otp-input-grouped',
      filename: 'grouped.tsx',
      source: groupedSource,
      title: '슬롯 합성',
    },
    {
      Component: SizesExample,
      coverage: [{ axis: 'size', values: ['xsm', 'sm', 'md', 'lg', 'xlg'] }],
      description: '주변 폼 제어와 슬롯 크기를 맞춥니다.',
      id: 'otp-input-sizes',
      filename: 'sizes.tsx',
      source: sizesSource,
      title: '크기',
    },
  ],
  optionAxes: [
    { name: 'length', control: 'segmented', defaultValue: '6', values: ['4', '6', '8'] },
    {
      name: 'size',
      control: 'segmented',
      defaultValue: 'md',
      values: ['xsm', 'sm', 'md', 'lg', 'xlg'],
    },
    { name: 'validationType', defaultValue: 'numeric', values: ['numeric', 'alphanumeric'] },
    { name: 'mask', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'disabled', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'readOnly', defaultValue: 'false', values: ['false', 'true'] },
    { name: 'invalid', defaultValue: 'false', values: ['false', 'true'] },
  ],
} satisfies ComponentPageData;
