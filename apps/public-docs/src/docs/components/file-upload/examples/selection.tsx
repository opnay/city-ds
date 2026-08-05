import { useState } from 'react';
import { FileUpload } from '@opnay/city-ds-react/file-upload';

export default function FileUploadSelectionExample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="city-docs-example-stack">
      <FileUpload.Root
        accept=".md,.txt"
        aria-label="여러 프로젝트 첨부 파일"
        files={files}
        multiple
        onFilesChange={setFiles}
      >
        <FileUpload.Trigger>여러 파일 선택</FileUpload.Trigger>
        <FileUpload.List aria-label="선택된 여러 파일" />
      </FileUpload.Root>
      <FileUpload.Root aria-label="하나의 프로젝트 첨부 파일">
        <FileUpload.Trigger>파일 하나 선택</FileUpload.Trigger>
        <FileUpload.List aria-label="선택된 파일" />
      </FileUpload.Root>
    </div>
  );
}
