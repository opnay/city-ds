import { useEffect, useId, useRef, useState } from 'react';
import { Avatar } from '@opnay/city-ds-react/avatar';
import { Button } from '@opnay/city-ds-react/button';
import { Field } from '@opnay/city-ds-react/field';
import { Input, InputGroup, Textarea } from '@opnay/city-ds-react/input';
import { X } from 'lucide-react';
import { BlockCard } from './block-card';
import { toast } from '@opnay/city-ds-react/toast';
import './blocks.css';

export interface ProfileValues {
  name: string;
  bio: string;
  image: File | null;
}

const initialProfile: ProfileValues = {
  name: '김서연',
  bio: '함께 일하기 좋은 제품을 만듭니다.',
  image: null,
};

export function ProfileManagement({
  onSave,
}: {
  onSave: (profile: ProfileValues) => Promise<void>;
}) {
  const [saved, setSaved] = useState(initialProfile);
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageError, setImageError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [attempted, setAttempted] = useState(false);
  const imageId = useId();
  const nameError = attempted && !profile.name.trim();
  const dirty =
    profile.name !== saved.name || profile.bio !== saved.bio || profile.image !== saved.image;

  useEffect(() => {
    if (!profile.image) {
      setImageUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(profile.image);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profile.image]);

  function edit(update: Partial<ProfileValues>) {
    setProfile((current) => ({ ...current, ...update }));
    setSaveError('');
  }

  return (
    <BlockCard
      title="프로필 관리"
      description="다른 사람에게 표시되는 사진과 소개를 관리합니다."
      render={<form noValidate />}
      onSubmit={async (event) => {
        event.preventDefault();
        if (pending.current || !dirty) return;
        setAttempted(true);
        if (!profile.name.trim() || profile.bio.length > 160) return;
        pending.current = true;
        setSaving(true);
        setSaveError('');
        const next = { ...profile, name: profile.name.trim() };
        try {
          await onSave(next);
          setSaved(next);
          setProfile(next);
          toast.success('프로필을 저장했습니다.');
        } catch {
          setSaveError('저장하지 못했습니다. 입력한 내용은 유지됩니다. 다시 시도하십시오.');
        } finally {
          pending.current = false;
          setSaving(false);
        }
      }}
    >
      <Field.Root invalid={!!imageError} disabled={saving}>
        <Field.Label className="city-text-supporting" htmlFor={imageId}>
          프로필 이미지
        </Field.Label>
        <div className="city-block-avatar-row">
          <InputGroup.Root
            size="lg"
            role="group"
            aria-label="프로필 이미지 선택"
            data-disabled={saving ? '' : undefined}
            className="city-block-image-control"
          >
            <Button
              size="lg"
              type="button"
              variant="ghost"
              className="city-block-image-trigger"
              disabled={saving}
              onClick={() => fileInput.current?.click()}
            >
              이미지 변경
            </Button>
            <Button
              size="lg"
              iconOnly
              aria-label="이미지 제거"
              className="city-block-image-remove focus-visible:ring-offset-0"
              type="button"
              variant="ghost"
              disabled={saving || !profile.image}
              onClick={() => {
                edit({ image: null });
                setImageError('');
              }}
            >
              <X size={16} aria-hidden="true" />
            </Button>
          </InputGroup.Root>
          <Avatar.Root size="lg">
            <Avatar.Image src={imageUrl} alt="프로필 이미지 미리보기" />
            <Avatar.Fallback>{profile.name.trim().slice(0, 2) || '사용자'}</Avatar.Fallback>
          </Avatar.Root>
        </div>
        <input
          ref={fileInput}
          id={imageId}
          type="file"
          tabIndex={-1}
          accept="image/png,image/jpeg,image/webp"
          className="city-block-sr-only"
          disabled={saving}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (!file) return;
            if (
              !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ||
              file.size > 5 * 1024 * 1024
            ) {
              setImageError('5MB 이하의 PNG, JPG, WebP 이미지를 선택하십시오.');
              return;
            }
            setImageError('');
            edit({ image: file });
          }}
        />
        <Field.Description>PNG, JPG, WebP · 최대 5MB</Field.Description>
        {imageError && <Field.Error match>{imageError}</Field.Error>}
      </Field.Root>
      <Field.Root invalid={nameError} disabled={saving}>
        <Field.Label className="city-text-supporting">표시 이름</Field.Label>
        <Input
          size="lg"
          name="name"
          autoComplete="nickname"
          required
          maxLength={50}
          value={profile.name}
          onChange={(event) => edit({ name: event.target.value })}
        />
        {nameError && <Field.Error match>표시 이름을 입력하십시오.</Field.Error>}
      </Field.Root>
      <Field.Root disabled={saving}>
        <Field.Label className="city-text-supporting">자기소개</Field.Label>
        <Textarea
          size="lg"
          name="bio"
          rows={3}
          maxLength={160}
          value={profile.bio}
          onChange={(event) => edit({ bio: event.target.value })}
        />
        <Field.Description>{profile.bio.length} / 160자 · 선택 입력</Field.Description>
      </Field.Root>
      {saveError && (
        <p role="alert" className="city-block-error">
          {saveError}
        </p>
      )}
      <div className="city-block-actions city-block-actions--separated">
        <Button
          size="lg"
          type="button"
          variant="outline"
          disabled={!dirty || saving}
          onClick={() => {
            setProfile(saved);
            setAttempted(false);
            setImageError('');
            setSaveError('');
          }}
        >
          취소
        </Button>
        <Button size="lg" type="submit" disabled={!dirty || saving}>
          {saving ? '저장 중…' : '변경 사항 저장'}
        </Button>
      </div>
    </BlockCard>
  );
}

export default function ProfileManagementExample() {
  return <ProfileManagement onSave={async () => {}} />;
}
