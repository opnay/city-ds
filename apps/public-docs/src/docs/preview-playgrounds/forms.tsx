import { useState } from 'react';
import { Accordion } from '@opnay/city-ds-react/accordion';
import { Calendar } from '@opnay/city-ds-react/calendar';
import { Checkbox } from '@opnay/city-ds-react/checkbox';
import { CheckboxGroup } from '@opnay/city-ds-react/checkbox-group';
import { Combobox } from '@opnay/city-ds-react/combobox';
import { DatePicker } from '@opnay/city-ds-react/date-picker';
import { DensityProvider } from '@opnay/city-ds-react/density-provider';
import { Field } from '@opnay/city-ds-react/field';
import { Fieldset } from '@opnay/city-ds-react/fieldset';
import { FileUpload } from '@opnay/city-ds-react/file-upload';
import { Input, InputGroup } from '@opnay/city-ds-react/input';
import { NumberInput } from '@opnay/city-ds-react/number-input';
import { Pagination } from '@opnay/city-ds-react/pagination';
import { RadioGroup } from '@opnay/city-ds-react/radio-group';
import { SearchInput } from '@opnay/city-ds-react/search-input';
import { SegmentedControl } from '@opnay/city-ds-react/segmented-control';
import { Select } from '@opnay/city-ds-react/select';
import { Switch } from '@opnay/city-ds-react/switch';
import { ToggleGroup } from '@opnay/city-ds-react/toggle-group';

import {
  isControlled,
  isEnabled,
  toControlSize,
  type PreviewOptionProps,
} from './types';

const TODAY = new Date(2026, 6, 15);
const PROJECTS = ['도시 포털', '교통 지도', '허가 추적기'];
const SELECT_ITEMS = { draft: '초안', review: '검토', done: '완료' } as const;
const TOGGLE_VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;

function SelectOptions() {
  return (
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.List>
            {Object.entries(SELECT_ITEMS).map(([value, label]) => (
              <Select.Item key={value} value={value}>
                <Select.ItemIndicator />
                <Select.ItemText>{label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  );
}

function ComboboxOptions() {
  return (
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.Empty>결과가 없습니다.</Combobox.Empty>
          <Combobox.List>
            {(item: string) => (
              <Combobox.Item key={item} value={item}>
                <Combobox.ItemIndicator />
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  );
}

export function DensityProviderPreview({ density }: PreviewOptionProps) {
  const [page, setPage] = useState(2);

  return (
    <DensityProvider density={density === 'compact' ? 'compact' : 'comfortable'}>
      <Pagination.Root aria-label="페이지 이동" onPageChange={setPage} page={page} totalPages={5} />
    </DensityProvider>
  );
}

export function ToggleGroupPreview({
  disabled,
  mode,
  multiple,
  orientation,
  pressed,
  size,
  variant,
}: PreviewOptionProps) {
  const [value, setValue] = useState(['bold']);
  const isMultiple = isEnabled(multiple);
  const initialValue = isEnabled(pressed) ? ['bold'] : [];
  const rootProps = isControlled(mode)
    ? { onValueChange: setValue, value }
    : { defaultValue: initialValue };

  return (
    <ToggleGroup
      aria-label="서식"
      disabled={isEnabled(disabled)}
      multiple={isMultiple}
      orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
      size={toControlSize(size)}
      variant={
        typeof variant === 'string' && TOGGLE_VARIANTS.includes(variant as (typeof TOGGLE_VARIANTS)[number])
          ? (variant as (typeof TOGGLE_VARIANTS)[number])
          : 'ghost'
      }
      {...rootProps}
    >
      <ToggleGroup.Item value="bold">굵게</ToggleGroup.Item>
      <ToggleGroup.Item value="italic">기울임</ToggleGroup.Item>
      <ToggleGroup.Item value="underline">밑줄</ToggleGroup.Item>
    </ToggleGroup>
  );
}

export function AccordionPreview({ disabled, mode, multiple }: PreviewOptionProps) {
  const [value, setValue] = useState(['overview']);
  const rootProps = isControlled(mode)
    ? { onValueChange: (nextValue: unknown[]) => setValue(nextValue as string[]), value }
    : { defaultValue: ['overview'] };

  return (
    <Accordion.Root disabled={isEnabled(disabled)} multiple={isEnabled(multiple)} {...rootProps}>
      <Accordion.Item value="overview">
        <Accordion.Header>
          <Accordion.Trigger>개요</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>프로젝트의 기본 정보를 확인합니다.</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="owner">
        <Accordion.Header>
          <Accordion.Trigger>담당자</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>플랫폼 팀에서 관리합니다.</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export function CalendarPreview({
  disabled,
  invalid,
  readOnly,
  showOutsideDays,
  size,
}: PreviewOptionProps) {
  const [value, setValue] = useState<Date | null>(TODAY);

  return (
    <Calendar
      aria-label="검토 날짜"
      disabled={isEnabled(disabled)}
      invalid={isEnabled(invalid)}
      onValueChange={setValue}
      readOnly={isEnabled(readOnly)}
      showOutsideDays={showOutsideDays !== false && showOutsideDays !== 'false'}
      size={toControlSize(size)}
      today={TODAY}
      value={value}
    />
  );
}

export function CheckboxPreview({ checked, disabled, indeterminate, size }: PreviewOptionProps) {
  const [localChecked, setLocalChecked] = useState(false);
  const isChecked = checked === undefined ? localChecked : isEnabled(checked);

  return (
    <label className="city-docs-example-row">
      <Checkbox
        checked={isChecked}
        disabled={isEnabled(disabled)}
        indeterminate={isEnabled(indeterminate)}
        onCheckedChange={setLocalChecked}
        size={toControlSize(size)}
      />
      알림 받기
    </label>
  );
}

export function CheckboxGroupPreview({ disabled, mode, size }: PreviewOptionProps) {
  const [value, setValue] = useState<string[]>(['email']);
  const rootProps = isControlled(mode)
    ? { onValueChange: setValue, value }
    : { defaultValue: ['email'] };

  return (
    <CheckboxGroup
      aria-label="알림 채널"
      disabled={isEnabled(disabled)}
      size={toControlSize(size)}
      {...rootProps}
    >
      <CheckboxGroup.Item value="email">이메일</CheckboxGroup.Item>
      <CheckboxGroup.Item value="push">푸시</CheckboxGroup.Item>
      <CheckboxGroup.Item value="sms">문자</CheckboxGroup.Item>
    </CheckboxGroup>
  );
}

export function ComboboxPreview({ disabled, mode, multiple, size }: PreviewOptionProps) {
  const [singleValue, setSingleValue] = useState('도시 포털');
  const [multipleValue, setMultipleValue] = useState<string[]>(['도시 포털']);
  const commonProps = {
    disabled: isEnabled(disabled),
    items: PROJECTS,
    size: toControlSize(size),
  };

  if (isEnabled(multiple)) {
    const valueProps = isControlled(mode)
      ? { onValueChange: setMultipleValue, value: multipleValue }
      : { defaultValue: ['도시 포털'] };

    return (
      <Combobox.Root multiple {...commonProps} {...valueProps}>
        <Combobox.InputGroup>
          <Combobox.Input aria-label="프로젝트" placeholder="프로젝트 검색" />
          <Combobox.Trigger />
        </Combobox.InputGroup>
        <ComboboxOptions />
      </Combobox.Root>
    );
  }

  const valueProps = isControlled(mode)
    ? {
        onValueChange: (nextValue: string | null) => setSingleValue(nextValue ?? PROJECTS[0] ?? ''),
        value: singleValue,
      }
    : { defaultValue: '도시 포털' };

  return (
    <Combobox.Root {...commonProps} {...valueProps}>
      <Combobox.InputGroup>
        <Combobox.Input aria-label="프로젝트" placeholder="프로젝트 검색" />
        <Combobox.Trigger />
      </Combobox.InputGroup>
      <ComboboxOptions />
    </Combobox.Root>
  );
}

export function DatePickerPreview({ disabled, invalid, open, readOnly, size }: PreviewOptionProps) {
  const [value, setValue] = useState<Date | null>(TODAY);
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = open === undefined ? localOpen : isEnabled(open);

  return (
    <DatePicker.Root
      disabled={isEnabled(disabled)}
      invalid={isEnabled(invalid)}
      onOpenChange={setLocalOpen}
      onValueChange={setValue}
      open={isOpen}
      readOnly={isEnabled(readOnly)}
      size={toControlSize(size)}
      value={value}
    >
      <DatePicker.Group>
        <DatePicker.Input aria-label="검토 날짜" />
        <DatePicker.Trigger aria-label="검토 날짜 달력 열기" />
      </DatePicker.Group>
      <DatePicker.Portal>
        <DatePicker.Positioner>
          <DatePicker.Popup>
            <DatePicker.Calendar aria-label="검토 날짜 달력" today={TODAY} />
          </DatePicker.Popup>
        </DatePicker.Positioner>
      </DatePicker.Portal>
    </DatePicker.Root>
  );
}

export function FieldPreview({ disabled, invalid }: PreviewOptionProps) {
  return (
    <Field.Root disabled={isEnabled(disabled)} invalid={isEnabled(invalid)}>
      <Field.Label>프로젝트 이름</Field.Label>
      <Input defaultValue="city-ds" />
      {isEnabled(invalid) ? (
        <Field.Error match>유효한 이름을 입력하십시오.</Field.Error>
      ) : (
        <Field.Description>소문자, 숫자, 하이픈을 사용하십시오.</Field.Description>
      )}
    </Field.Root>
  );
}

export function FieldsetPreview({ appearance, disabled }: PreviewOptionProps) {
  return (
    <Fieldset.Root
      appearance={appearance === 'band' || appearance === 'plain' ? appearance : 'outline'}
      disabled={isEnabled(disabled)}
    >
      <Fieldset.Legend>알림 채널</Fieldset.Legend>
      <Fieldset.Content className="city-docs-fieldset-options-3">
        {['이메일', '문자', '푸시'].map((channel) => (
          <label className="city-docs-example-row" key={channel}>
            <Checkbox defaultChecked={channel === '이메일'} />
            {channel}
          </label>
        ))}
      </Fieldset.Content>
    </Fieldset.Root>
  );
}

export function FileUploadPreview({ density, disabled, multiple }: PreviewOptionProps) {
  const [files, setFiles] = useState<File[]>([]);
  const isMultiple = isEnabled(multiple);

  return (
    <DensityProvider density={density === 'compact' ? 'compact' : 'comfortable'}>
      <FileUpload.Root
        accept=".md,.txt"
        aria-label="프로젝트 첨부 파일"
        disabled={isEnabled(disabled)}
        files={files}
        multiple={isMultiple}
        onFilesChange={setFiles}
      >
        <FileUpload.Trigger>{isMultiple ? '파일 선택' : '파일 하나 선택'}</FileUpload.Trigger>
        <FileUpload.List aria-label="선택된 파일" />
      </FileUpload.Root>
    </DensityProvider>
  );
}

export function InputPreview({ addonPosition, disabled, invalid, size }: PreviewOptionProps) {
  const isLeading = addonPosition !== 'trailing';

  return (
    <InputGroup.Root>
      {isLeading ? <InputGroup.Addon>https://</InputGroup.Addon> : null}
      <Input
        aria-label="주소"
        aria-invalid={isEnabled(invalid) || undefined}
        disabled={isEnabled(disabled)}
        placeholder="example.com"
        size={toControlSize(size)}
      />
      {isLeading ? null : <InputGroup.Addon position="trailing">.gov</InputGroup.Addon>}
    </InputGroup.Root>
  );
}

export function NumberInputPreview({ disabled, mode, size }: PreviewOptionProps) {
  const [value, setValue] = useState(4);
  const rootProps = isControlled(mode)
    ? { onValueChange: (nextValue: number | null) => setValue(nextValue ?? 1), value }
    : { defaultValue: 4 };

  return (
    <NumberInput.Root disabled={isEnabled(disabled)} max={12} min={1} size={toControlSize(size)} {...rootProps}>
      <NumberInput.Group>
        <NumberInput.Input aria-label="인원" />
        <NumberInput.Decrement aria-label="인원 줄이기" />
        <NumberInput.Increment aria-label="인원 늘리기" />
      </NumberInput.Group>
    </NumberInput.Root>
  );
}

export function RadioGroupPreview({ disabled, mode, size }: PreviewOptionProps) {
  const [value, setValue] = useState('team');
  const rootProps = isControlled(mode)
    ? { onValueChange: setValue, value }
    : { defaultValue: 'team' };

  return (
    <RadioGroup
      aria-label="공개 범위"
      disabled={isEnabled(disabled)}
      size={toControlSize(size)}
      {...rootProps}
    >
      <RadioGroup.Item value="private">비공개</RadioGroup.Item>
      <RadioGroup.Item value="team">팀</RadioGroup.Item>
      <RadioGroup.Item value="public">전체 공개</RadioGroup.Item>
    </RadioGroup>
  );
}

export function SearchInputPreview({
  disabled,
  hideWhenEmpty,
  invalid,
  loading,
  size,
}: PreviewOptionProps) {
  const [value, setValue] = useState('city');

  return (
    <SearchInput.Root
      disabled={isEnabled(disabled)}
      invalid={isEnabled(invalid)}
      loading={isEnabled(loading)}
      onValueChange={setValue}
      size={toControlSize(size)}
      value={value}
    >
      <SearchInput.Group>
        <SearchInput.Input aria-label="문서 검색" placeholder="컴포넌트 검색" />
        <SearchInput.Clear hideWhenEmpty={hideWhenEmpty !== false && hideWhenEmpty !== 'false'} />
        <SearchInput.Loading>검색 중</SearchInput.Loading>
        <SearchInput.Submit aria-label="검색" />
      </SearchInput.Group>
    </SearchInput.Root>
  );
}

export function SegmentedControlPreview({ disabled, mode, size }: PreviewOptionProps) {
  const [value, setValue] = useState('grid');
  const rootProps = isControlled(mode)
    ? { onValueChange: setValue, value }
    : { defaultValue: 'grid' };

  return (
    <SegmentedControl
      aria-label="보기 방식"
      disabled={isEnabled(disabled)}
      size={toControlSize(size)}
      {...rootProps}
    >
      <SegmentedControl.Item value="grid">격자</SegmentedControl.Item>
      <SegmentedControl.Item value="list">목록</SegmentedControl.Item>
      <SegmentedControl.Item disabled value="map">
        지도
      </SegmentedControl.Item>
    </SegmentedControl>
  );
}

export function SelectPreview({ mode, multiple, size }: PreviewOptionProps) {
  const [singleValue, setSingleValue] = useState<string | null>('draft');
  const [multipleValue, setMultipleValue] = useState<string[]>(['draft']);
  const commonProps = { items: SELECT_ITEMS, size: toControlSize(size) };

  if (isEnabled(multiple)) {
    const valueProps = isControlled(mode)
      ? { onValueChange: setMultipleValue, value: multipleValue }
      : { defaultValue: ['draft'] };

    return (
      <Select.Root multiple {...commonProps} {...valueProps}>
        <Select.Label>작업 상태</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="상태 선택" />
          <Select.Icon />
        </Select.Trigger>
        <SelectOptions />
      </Select.Root>
    );
  }

  const valueProps = isControlled(mode)
    ? { onValueChange: setSingleValue, value: singleValue }
    : { defaultValue: 'draft' };

  return (
    <Select.Root {...commonProps} {...valueProps}>
      <Select.Label>작업 상태</Select.Label>
      <Select.Trigger>
        <Select.Value placeholder="상태 선택" />
        <Select.Icon />
      </Select.Trigger>
      <SelectOptions />
    </Select.Root>
  );
}

export function SwitchPreview({ checked, disabled, size }: PreviewOptionProps) {
  const [localChecked, setLocalChecked] = useState(false);
  const isChecked = checked === undefined ? localChecked : isEnabled(checked);

  return (
    <label className="city-docs-example-row">
      <Switch
        checked={isChecked}
        disabled={isEnabled(disabled)}
        onCheckedChange={setLocalChecked}
        size={toControlSize(size)}
      />
      알림 받기
    </label>
  );
}
