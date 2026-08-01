import { useRef, useState, type FormEvent, type RefObject } from 'react';
import { FileText, Plus, X } from 'lucide-react';
import {
  Accordion,
  AlertDialog,
  Badge,
  Button,
  CheckboxGroup,
  Combobox,
  Dialog,
  Drawer,
  Field,
  Fieldset,
  FileUpload,
  Input,
  NumberField,
  Progress,
  RadioGroup,
  Select,
} from '@opnay/city-ds-react';

import {
  CREW_ITEMS,
  isTerminalStatus,
  LOCATIONS,
  NOTIFICATION_CHANNEL_LABELS,
  WORK_ORDER_DISTRICT_ITEMS,
  type Crew,
  type District,
  type NotificationChannel,
  type Priority,
  type WorkOrder,
} from './dashboard-data';
import { WORK_ORDER_STATUS_BADGES } from './relay-ui';

export interface CreateWorkOrderInput {
  attachmentNames: string[];
  district: District;
  location: string;
  notificationChannels: NotificationChannel[];
  priority: Priority;
  responseMinutes: number;
  title: string;
}

interface CreateWorkOrderDialogProps {
  onCreate: (input: CreateWorkOrderInput) => void;
}

export function CreateWorkOrderDialog({ onCreate }: CreateWorkOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState<District>('종로구');
  const [priority, setPriority] = useState<Priority>('보통');
  const [responseMinutes, setResponseMinutes] = useState<number | null>(60);
  const [channels, setChannels] = useState<NotificationChannel[]>(['push']);
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setTitle('');
    setLocation('');
    setDistrict('종로구');
    setPriority('보통');
    setResponseMinutes(60);
    setChannels(['push']);
    setFiles([]);
    setSubmitted(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (!title.trim() || !location) {
      if (!title.trim()) {
        titleInputRef.current?.focus();
      } else {
        locationInputRef.current?.focus();
      }
      return;
    }

    onCreate({
      attachmentNames: files.map((file) => file.name),
      district,
      location,
      notificationChannels: channels,
      priority,
      responseMinutes: responseMinutes ?? 60,
      title: title.trim(),
    });
    setOpen(false);
    reset();
  };

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Trigger render={<Button size="md" />}>
        <Plus aria-hidden="true" size={17} />새 작업 만들기
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport className="relay-work-order-viewport">
          <Dialog.Popup className="relay-work-order-dialog" scroll="body" size="lg">
            <form className="relay-dialog-form" noValidate onSubmit={handleSubmit}>
              <Dialog.Header className="relay-work-order-header">
                <div>
                  <Dialog.Title>새 작업 요청</Dialog.Title>
                  <Dialog.Description>작업 위치와 대응 기준을 입력합니다.</Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label="작업 생성 닫기"
                  render={<Button iconOnly size="sm" variant="ghost" />}
                >
                  <X aria-hidden="true" size={18} />
                </Dialog.Close>
              </Dialog.Header>

              <Dialog.Body className="relay-work-order-body">
                <Fieldset.Root appearance="plain" className="relay-work-order-fieldset">
                  <Fieldset.Legend>작업 정보</Fieldset.Legend>
                  <Fieldset.Description>별표(*)로 표시된 항목은 필수입니다.</Fieldset.Description>
                  <Fieldset.Content className="relay-work-order-sections">
                    <div className="relay-form-grid">
                      <Field.Root
                        className="relay-form-span-2"
                        invalid={submitted && !title.trim()}
                      >
                        <Field.Label>
                          작업 제목{' '}
                          <span aria-hidden="true" className="relay-required-marker">
                            *
                          </span>
                        </Field.Label>
                        <Input
                          aria-label="작업 제목"
                          aria-required="true"
                          onValueChange={setTitle}
                          placeholder="예: 보행 신호 제어함 전원 점검"
                          ref={titleInputRef}
                          value={title}
                        />
                        <Field.Error match={submitted && !title.trim()}>
                          작업 제목을 입력하십시오.
                        </Field.Error>
                      </Field.Root>

                      <Field.Root invalid={submitted && !location}>
                        <Combobox.Root
                          items={[...LOCATIONS]}
                          onValueChange={(value) => setLocation(value ?? '')}
                          value={location || null}
                        >
                          <Field.Label>
                            시설 위치{' '}
                            <span aria-hidden="true" className="relay-required-marker">
                              *
                            </span>
                          </Field.Label>
                          <Combobox.InputGroup>
                            <Combobox.Input
                              aria-required="true"
                              placeholder="시설을 검색하십시오"
                              ref={locationInputRef}
                            />
                            <Combobox.Clear />
                            <Combobox.Trigger />
                          </Combobox.InputGroup>
                          <Combobox.Portal>
                            <Combobox.Positioner sideOffset={6}>
                              <Combobox.Popup>
                                <Combobox.Empty>일치하는 시설이 없습니다.</Combobox.Empty>
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
                          <Field.Error match={submitted && !location}>
                            시설 위치를 선택하십시오.
                          </Field.Error>
                        </Combobox.Root>
                      </Field.Root>

                      <Field.Root>
                        <Select.Root
                          items={WORK_ORDER_DISTRICT_ITEMS}
                          onValueChange={(value) => value && setDistrict(value)}
                          value={district}
                        >
                          <Select.Label>담당 권역</Select.Label>
                          <Select.Trigger>
                            <Select.Value />
                            <Select.Icon />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Positioner sideOffset={6}>
                              <Select.Popup>
                                <Select.List>
                                  {Object.keys(WORK_ORDER_DISTRICT_ITEMS).map((item) => (
                                    <Select.Item key={item} value={item}>
                                      <Select.ItemIndicator />
                                      <Select.ItemText>{item}</Select.ItemText>
                                    </Select.Item>
                                  ))}
                                </Select.List>
                              </Select.Popup>
                            </Select.Positioner>
                          </Select.Portal>
                        </Select.Root>
                      </Field.Root>
                    </div>

                    <section
                      className="relay-work-order-section"
                      aria-labelledby="response-criteria-heading"
                    >
                      <h3
                        className="relay-work-order-section-heading"
                        id="response-criteria-heading"
                      >
                        대응 기준
                      </h3>
                      <div className="relay-priority-response-grid">
                        <Field.Root>
                          <Field.Label>우선순위</Field.Label>
                          <RadioGroup
                            aria-label="우선순위"
                            className="relay-priority-options"
                            onValueChange={setPriority}
                            value={priority}
                          >
                            <RadioGroup.Item value="긴급">긴급</RadioGroup.Item>
                            <RadioGroup.Item value="높음">높음</RadioGroup.Item>
                            <RadioGroup.Item value="보통">보통</RadioGroup.Item>
                          </RadioGroup>
                          <Field.Description>
                            긴급 작업은 SLA 위험 목록에 우선 표시됩니다.
                          </Field.Description>
                        </Field.Root>

                        <Field.Root className="relay-response-field">
                          <Field.Label>예상 대응시간</Field.Label>
                          <NumberField.Root
                            max={240}
                            min={15}
                            onValueChange={setResponseMinutes}
                            step={15}
                            value={responseMinutes}
                          >
                            <NumberField.Group className="relay-response-control">
                              <NumberField.Input aria-label="예상 대응시간" />
                              <NumberField.Decrement aria-label="예상 대응시간 15분 줄이기" />
                              <NumberField.Increment aria-label="예상 대응시간 15분 늘리기" />
                            </NumberField.Group>
                          </NumberField.Root>
                          <Field.Description>15분 단위, 최대 240분</Field.Description>
                        </Field.Root>
                      </div>
                    </section>

                    <section
                      className="relay-work-order-section"
                      aria-labelledby="notification-attachment-heading"
                    >
                      <h3
                        className="relay-work-order-section-heading"
                        id="notification-attachment-heading"
                      >
                        알림 및 첨부
                      </h3>
                      <div className="relay-notification-attachment-grid">
                        <Field.Root>
                          <Field.Label id="channels-label">알림 채널</Field.Label>
                          <CheckboxGroup
                            aria-labelledby="channels-label"
                            className="relay-notification-options"
                            onValueChange={(value) => setChannels(value as NotificationChannel[])}
                            value={channels}
                          >
                            <CheckboxGroup.Item value="push">앱 푸시</CheckboxGroup.Item>
                            <CheckboxGroup.Item value="email">이메일</CheckboxGroup.Item>
                            <CheckboxGroup.Item value="sms">문자</CheckboxGroup.Item>
                          </CheckboxGroup>
                        </Field.Root>

                        <Field.Root>
                          <Field.Label id="files-label">현장 첨부</Field.Label>
                          <FileUpload.Root
                            accept=".jpg,.jpeg,.png,.pdf"
                            aria-labelledby="files-label"
                            className="relay-file-upload"
                            files={files}
                            labels={{
                              remove: (file) => (file ? `${file.name} 제거` : '파일 제거'),
                            }}
                            multiple
                            onFilesChange={setFiles}
                          >
                            <FileUpload.Trigger>
                              <FileText aria-hidden="true" size={16} />
                              파일 선택
                            </FileUpload.Trigger>
                            <span className="relay-file-upload-hint">
                              사진 또는 PDF · 데모 외부로 전송하지 않음
                            </span>
                            <FileUpload.List aria-label="선택된 현장 첨부" />
                          </FileUpload.Root>
                        </Field.Root>
                      </div>
                    </section>
                  </Fieldset.Content>
                </Fieldset.Root>
              </Dialog.Body>

              <Dialog.Footer className="relay-work-order-footer">
                <Dialog.Close render={<Button size="md" variant="secondary" />}>취소</Dialog.Close>
                <Button size="md" type="submit">
                  작업 생성
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface WorkOrderDetailsDrawerProps {
  finalFocus: RefObject<HTMLElement | null>;
  onClose: () => void;
  onCrewChange: (id: string, crew: Crew) => void;
  onRequestCancel: (id: string, trigger: HTMLElement | null) => void;
  open: boolean;
  order: WorkOrder | null;
}

export function WorkOrderDetailsDrawer({
  finalFocus,
  onClose,
  onCrewChange,
  onRequestCancel,
  open,
  order,
}: WorkOrderDetailsDrawerProps) {
  if (!order) {
    return null;
  }

  return (
    <Drawer.Root
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      open={open}
      swipeDirection="right"
    >
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport side="right">
          <Drawer.Popup
            className="relay-details-drawer"
            finalFocus={finalFocus}
            side="right"
            size="lg"
          >
            <Drawer.Header>
              <div>
                <Badge {...WORK_ORDER_STATUS_BADGES[order.status]}>{order.status}</Badge>
                <Drawer.Title>{order.title}</Drawer.Title>
                <Drawer.Description>
                  {order.id} · {order.district} · {order.location}
                </Drawer.Description>
              </div>
              <Drawer.Close
                aria-label="작업 상세 닫기"
                render={<Button iconOnly size="sm" variant="ghost" />}
              >
                <X aria-hidden="true" size={18} />
              </Drawer.Close>
            </Drawer.Header>

            <Drawer.Body className="relay-drawer-body">
              <dl className="relay-detail-list">
                <div>
                  <dt>우선순위</dt>
                  <dd>{order.priority}</dd>
                </div>
                <div>
                  <dt>최근 업데이트</dt>
                  <dd>{order.updatedAt}</dd>
                </div>
                <div>
                  <dt>SLA 마감</dt>
                  <dd>{order.slaDueAt}</dd>
                </div>
              </dl>

              <Progress.Root aria-label={`${order.id} SLA 진행`} value={order.progress}>
                <div className="relay-progress-label">
                  <Progress.Label>SLA 진행</Progress.Label>
                  <Progress.Value />
                </div>
                <Progress.Track>
                  <Progress.Indicator />
                </Progress.Track>
              </Progress.Root>

              <Select.Root
                disabled={isTerminalStatus(order.status)}
                items={CREW_ITEMS}
                onValueChange={(value) => value && onCrewChange(order.id, value)}
                value={order.crew}
              >
                <Select.Label>담당 현장팀</Select.Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner sideOffset={6}>
                    <Select.Popup>
                      <Select.List>
                        {Object.keys(CREW_ITEMS).map((crew) => (
                          <Select.Item
                            disabled={order.status === '진행 중' && crew === '미배정'}
                            key={crew}
                            value={crew}
                          >
                            <Select.ItemIndicator />
                            <Select.ItemText>{crew}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>

              {order.responseMinutes ||
              order.notificationChannels?.length ||
              order.attachmentNames?.length ? (
                <dl className="relay-detail-list relay-detail-list-secondary">
                  {order.responseMinutes ? (
                    <div>
                      <dt>예상 대응시간</dt>
                      <dd>{order.responseMinutes}분</dd>
                    </div>
                  ) : null}
                  {order.notificationChannels?.length ? (
                    <div>
                      <dt>알림 채널</dt>
                      <dd>
                        {order.notificationChannels
                          .map((channel) => NOTIFICATION_CHANNEL_LABELS[channel])
                          .join(', ')}
                      </dd>
                    </div>
                  ) : null}
                  {order.attachmentNames?.length ? (
                    <div>
                      <dt>현장 첨부</dt>
                      <dd>{order.attachmentNames.join(', ')}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}

              <Accordion.Root defaultValue={['activity']}>
                <Accordion.Item value="activity">
                  <Accordion.Header>
                    <Accordion.Trigger>최근 활동</Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Panel>
                    <ol className="relay-activity-list">
                      <li>
                        <strong>{order.updatedAt}</strong>
                        <span>현장 상태가 “{order.status}”로 변경되었습니다.</span>
                      </li>
                      <li>
                        <strong>오늘 09:40</strong>
                        <span>{order.crew}에 작업이 전달되었습니다.</span>
                      </li>
                      <li>
                        <strong>오늘 09:12</strong>
                        <span>운영 센터에서 작업 요청을 접수했습니다.</span>
                      </li>
                    </ol>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="checklist">
                  <Accordion.Header>
                    <Accordion.Trigger>현장 체크리스트</Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Panel>
                    안전 구역 확보, 설비 전원 확인, 조치 전후 사진 기록을 완료하십시오.
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion.Root>
            </Drawer.Body>
            <Drawer.Footer>
              <Button
                data-order-cancel={order.id}
                disabled={isTerminalStatus(order.status)}
                onClick={(event) => onRequestCancel(order.id, event.currentTarget)}
                size="md"
                variant="destructive"
              >
                작업 취소
              </Button>
              <Drawer.Close render={<Button size="md" variant="secondary" />}>닫기</Drawer.Close>
            </Drawer.Footer>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

interface CancelWorkOrderDialogProps {
  finalFocus: RefObject<HTMLElement | null>;
  onCancel: (id: string) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  order: WorkOrder | null;
}

export function CancelWorkOrderDialog({
  finalFocus,
  onCancel,
  onOpenChange,
  open,
  order,
}: CancelWorkOrderDialogProps) {
  return (
    <AlertDialog.Root onOpenChange={onOpenChange} open={open}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Viewport>
          <AlertDialog.Popup finalFocus={finalFocus}>
            <AlertDialog.Title>작업을 취소하시겠습니까?</AlertDialog.Title>
            <AlertDialog.Description>
              {order
                ? `${order.id} ${order.title} 작업이 취소 상태로 변경됩니다. 알림에서 실행 취소할 수 있습니다.`
                : '선택한 작업이 취소 상태로 변경됩니다.'}
            </AlertDialog.Description>
            <div className="relay-confirmation-actions">
              <AlertDialog.Cancel render={<Button size="md" variant="secondary" />}>
                돌아가기
              </AlertDialog.Cancel>
              <AlertDialog.Action
                onClick={() => {
                  if (order) {
                    onCancel(order.id);
                  }
                }}
                render={<Button size="md" variant="destructive" />}
              >
                작업 취소
              </AlertDialog.Action>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
