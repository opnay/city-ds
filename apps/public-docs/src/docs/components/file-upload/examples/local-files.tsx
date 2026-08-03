import { useState } from 'react';
import { FileUpload } from '@opnay/city-ds-react/file-upload';

export default function FileUploadLocalFilesExample() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="city-docs-example-stack">
      <FileUpload.Root
        accept=".md,.txt"
        aria-label="프로젝트 첨부 파일"
        density="comfortable"
        files={files}
        multiple
        onFilesChange={setFiles}
      >
        <FileUpload.Trigger>파일 선택</FileUpload.Trigger>
        <FileUpload.List aria-label="선택된 파일" />
      </FileUpload.Root>
      <FileUpload.Root aria-label="조밀한 첨부 파일" density="compact" disabled>
        <FileUpload.Trigger>비활성 파일 선택</FileUpload.Trigger>
        <FileUpload.List aria-label="비활성 선택 파일" />
      </FileUpload.Root>
    </div>
  );
}
