import { FileUpload } from '@opnay/city-ds-react/file-upload';

const densities = ['comfortable', 'compact'] as const;

export default function FileUploadDensityExample() {
  return (
    <div className="city-docs-example-stack">
      {densities.map((density) => (
        <FileUpload.Root aria-label={`${density} 첨부 파일`} density={density} key={density}>
          <FileUpload.Trigger>{density} 파일 선택</FileUpload.Trigger>
          <FileUpload.List aria-label={`${density} 선택 파일`} />
        </FileUpload.Root>
      ))}
    </div>
  );
}
