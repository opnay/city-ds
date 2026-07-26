'use client';

import * as React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '../../lib/cn';

function filesMatch(first: File, second: File): boolean {
  return (
    first.name === second.name &&
    first.size === second.size &&
    first.type === second.type &&
    first.lastModified === second.lastModified
  );
}

function uniqueFiles(files: readonly File[]): File[] {
  return files.reduce<File[]>((unique, file) => {
    if (!unique.some((candidate) => filesMatch(candidate, file))) {
      unique.push(file);
    }

    return unique;
  }, []);
}

function getNextFiles(
  currentFiles: readonly File[],
  selectedFiles: FileList | null,
  multiple: boolean,
): File[] {
  const selected = Array.from(selectedFiles ?? []);

  if (!multiple) {
    return selected.length > 0 ? [selected[0] as File] : [];
  }

  return uniqueFiles([...currentFiles, ...selected]);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 ** 2) {
    return `${Math.round((bytes / 1024) * 10) / 10} KB`;
  }

  return `${Math.round((bytes / 1024 ** 2) * 10) / 10} MB`;
}

export interface FileUploadState extends Record<string, unknown> {
  disabled: boolean;
  files: readonly File[];
  multiple: boolean;
}

interface FileUploadContextValue extends FileUploadState {
  accept?: string | undefined;
  inputId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  name?: string | undefined;
  openFileDialog: () => void;
  removeFile: (index: number) => void;
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(null);

function useFileUploadContext(componentName: string): FileUploadContextValue {
  const context = React.useContext(FileUploadContext);

  if (!context) {
    throw new Error(`${componentName} must be used within FileUpload.Root.`);
  }

  return context;
}

export interface FileUploadRootProps extends Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children' | 'className'
> {
  accept?: string;
  children?: React.ReactNode;
  className?: string;
  defaultFiles?: readonly File[];
  disabled?: boolean;
  files?: readonly File[];
  multiple?: boolean;
  name?: string;
  onFilesChange?: (files: File[]) => void;
  render?: useRender.ComponentProps<'div', FileUploadState>['render'];
}

export const FileUploadRoot = React.forwardRef<HTMLDivElement, FileUploadRootProps>(
  (
    {
      accept,
      children,
      className,
      defaultFiles = [],
      disabled = false,
      files: controlledFiles,
      multiple = false,
      name,
      onFilesChange,
      render,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledFiles, setUncontrolledFiles] = React.useState<File[]>(() =>
      uniqueFiles(defaultFiles),
    );
    const inputRef = React.useRef<HTMLInputElement>(null);
    const inputId = React.useId();
    const files = controlledFiles === undefined ? uncontrolledFiles : uniqueFiles(controlledFiles);
    const state = React.useMemo<FileUploadState>(
      () => ({ disabled, files, multiple }),
      [disabled, files, multiple],
    );
    const setFiles = React.useCallback(
      (nextFiles: File[]) => {
        const uniqueNextFiles = uniqueFiles(nextFiles);

        if (controlledFiles === undefined) {
          setUncontrolledFiles(uniqueNextFiles);
        }

        onFilesChange?.(uniqueNextFiles);
      },
      [controlledFiles, onFilesChange],
    );
    const openFileDialog = React.useCallback(() => {
      if (!disabled) {
        inputRef.current?.click();
      }
    }, [disabled]);
    const removeFile = React.useCallback(
      (index: number) => {
        if (disabled || index < 0 || index >= files.length) {
          return;
        }

        setFiles(files.filter((_, fileIndex) => fileIndex !== index));
      },
      [disabled, files, setFiles],
    );
    const context = React.useMemo<FileUploadContextValue>(
      () => ({
        accept,
        disabled,
        files,
        inputId,
        inputRef,
        multiple,
        name,
        openFileDialog,
        removeFile,
      }),
      [accept, disabled, files, inputId, multiple, name, openFileDialog, removeFile],
    );
    const content = (
      <>
        <input
          accept={accept}
          aria-label={props['aria-label'] ?? 'File upload'}
          aria-labelledby={props['aria-labelledby']}
          className="sr-only"
          data-city-file-upload-input=""
          disabled={disabled}
          id={inputId}
          multiple={multiple}
          name={name}
          onChange={(event) => setFiles(getNextFiles(files, event.currentTarget.files, multiple))}
          ref={inputRef}
          tabIndex={-1}
          type="file"
        />
        {children}
      </>
    );
    const root = useRender<FileUploadState, HTMLDivElement>({
      defaultTagName: 'div',
      ref,
      render,
      state,
      props: {
        ...props,
        children: content,
        className: cn('grid gap-2', className),
        'data-city-file-upload-root': '',
        'data-disabled': disabled ? '' : undefined,
        'data-file-count': String(files.length),
      },
    });

    return <FileUploadContext.Provider value={context}>{root}</FileUploadContext.Provider>;
  },
);

FileUploadRoot.displayName = 'FileUpload.Root';

type FileUploadButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof BaseButton>,
  'className' | 'disabled' | 'onClick'
> & {
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

export type FileUploadTriggerProps = FileUploadButtonProps;

export const FileUploadTrigger = React.forwardRef<HTMLElement, FileUploadTriggerProps>(
  ({ children, className, disabled, onClick, ...props }, ref) => {
    const context = useFileUploadContext('FileUpload.Trigger');
    const isDisabled = disabled || context.disabled;

    return (
      <BaseButton
        {...props}
        aria-controls={context.inputId}
        className={cn(
          'rounded-city-sm border-city-input bg-city-surface-raised text-city-foreground hover:bg-city-accent active:bg-city-accent-active focus-visible:outline-city-ring inline-flex h-9 w-fit items-center justify-center border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40',
          className,
        )}
        disabled={isDisabled}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented && !isDisabled) {
            context.openFileDialog();
          }
        }}
        ref={ref}
        type="button"
      >
        {children ?? 'Choose files'}
      </BaseButton>
    );
  },
);

FileUploadTrigger.displayName = 'FileUpload.Trigger';

export interface FileUploadListProps extends Omit<
  React.ComponentPropsWithoutRef<'ul'>,
  'children' | 'className'
> {
  children?: React.ReactNode | ((file: File, index: number) => React.ReactNode);
  className?: string;
  render?: useRender.ComponentProps<'ul', FileUploadState>['render'];
}

export const FileUploadList = React.forwardRef<HTMLUListElement, FileUploadListProps>(
  ({ children, className, render, ...props }, ref) => {
    const context = useFileUploadContext('FileUpload.List');
    const content =
      typeof children === 'function'
        ? context.files.map((file, index) => (
            <React.Fragment key={`${file.name}-${file.lastModified}-${index}`}>
              {children(file, index)}
            </React.Fragment>
          ))
        : (children ??
          context.files.map((file, index) => (
            <FileUploadItem
              file={file}
              index={index}
              key={`${file.name}-${file.lastModified}-${index}`}
            />
          )));
    return useRender<FileUploadState, HTMLUListElement>({
      defaultTagName: 'ul',
      ref,
      render,
      state: context,
      props: {
        ...props,
        children: content,
        className: cn('grid list-none gap-1 p-0', className),
        'data-city-file-upload-list': '',
      },
    });
  },
);

FileUploadList.displayName = 'FileUpload.List';

export interface FileUploadItemProps extends Omit<
  React.ComponentPropsWithoutRef<'li'>,
  'className'
> {
  children?: React.ReactNode;
  className?: string;
  file?: File;
  index?: number;
  render?: useRender.ComponentProps<'li', FileUploadState>['render'];
}

export const FileUploadItem = React.forwardRef<HTMLLIElement, FileUploadItemProps>(
  ({ children, className, file: fileProp, index, render, ...props }, ref) => {
    const context = useFileUploadContext('FileUpload.Item');
    const resolvedIndex = index ?? (fileProp ? context.files.indexOf(fileProp) : -1);
    const file = fileProp ?? context.files[resolvedIndex];

    const content = file
      ? (children ?? (
          <>
            <span className="min-w-0 flex-1 truncate">{file.name}</span>
            <span className="text-city-muted-foreground shrink-0">{formatFileSize(file.size)}</span>
            <FileUploadRemove index={resolvedIndex} />
          </>
        ))
      : null;

    return useRender<FileUploadState, HTMLLIElement, boolean>({
      defaultTagName: 'li',
      enabled: Boolean(file),
      ref,
      render,
      state: context,
      props: {
        ...props,
        children: content,
        className: cn(
          'flex min-w-0 items-center gap-2 rounded-city-sm border border-city-border bg-city-surface px-2 py-1.5 text-sm text-city-foreground',
          className,
        ),
        'data-city-file-upload-item': '',
      },
    });
  },
);

FileUploadItem.displayName = 'FileUpload.Item';

export interface FileUploadRemoveProps extends FileUploadButtonProps {
  index?: number;
}

export const FileUploadRemove = React.forwardRef<HTMLElement, FileUploadRemoveProps>(
  ({ children, className, disabled, index = -1, onClick, ...props }, ref) => {
    const context = useFileUploadContext('FileUpload.Remove');
    const file = context.files[index];
    const isDisabled = (disabled ?? context.disabled) || !file;

    return (
      <BaseButton
        {...props}
        aria-label={file ? `Remove ${file.name}` : 'Remove file'}
        className={cn(
          'rounded-city-xs text-city-muted-foreground hover:bg-city-accent hover:text-city-accent-foreground active:bg-city-accent-active focus-visible:outline-city-ring inline-flex h-6 shrink-0 items-center justify-center px-1.5 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40',
          className,
        )}
        disabled={isDisabled}
        onClick={(event) => {
          onClick?.(event);

          if (!event.defaultPrevented && !isDisabled) {
            context.removeFile(index);
          }
        }}
        ref={ref}
        type="button"
      >
        {children ?? 'Remove'}
      </BaseButton>
    );
  },
);

FileUploadRemove.displayName = 'FileUpload.Remove';

export const FileUpload = {
  Root: FileUploadRoot,
  Trigger: FileUploadTrigger,
  List: FileUploadList,
  Item: FileUploadItem,
  Remove: FileUploadRemove,
} as const;
