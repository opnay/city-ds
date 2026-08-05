import { FileUpload } from '@opnay/city-ds-react/file-upload';

export default function FileUploadDisabledExample() {
  return (
    <FileUpload.Root aria-label="비활성 첨부 파일" disabled>
      <FileUpload.Trigger>비활성 파일 선택</FileUpload.Trigger>
      <FileUpload.List aria-label="비활성 선택 파일" />
    </FileUpload.Root>
  );
}
