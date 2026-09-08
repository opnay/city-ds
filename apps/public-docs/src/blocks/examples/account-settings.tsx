import { useState } from 'react';
import { Button } from '@opnay/city-ds-react/button';
import { Field } from '@opnay/city-ds-react/field';
import { Input } from '@opnay/city-ds-react/input';
import { Switch } from '@opnay/city-ds-react/switch';
import './blocks.css';

const initialProfile = { name: '김서연', email: 'seoyeon@example.com', notifications: true };

export default function AccountSettings() {
  const [saved, setSaved] = useState(initialProfile);
  const [profile, setProfile] = useState(initialProfile);
  const [message, setMessage] = useState('');
  const dirty =
    profile.name !== saved.name ||
    profile.email !== saved.email ||
    profile.notifications !== saved.notifications;

  return (
    <form
      className="city-block-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (!dirty) return;
        setSaved(profile);
        setMessage('변경 사항을 미리보기에 저장했습니다.');
      }}
      onChange={() => setMessage('')}
    >
      <div>
        <h3 className="city-block-title">계정 설정</h3>
        <p className="city-block-description">
          팀에 표시되는 프로필과 알림 수신 여부를 설정합니다.
        </p>
      </div>
      <Field.Root>
        <Field.Label>이름</Field.Label>
        <Input
          required
          name="name"
          autoComplete="name"
          value={profile.name}
          onChange={(event) => setProfile({ ...profile, name: event.target.value })}
        />
      </Field.Root>
      <Field.Root>
        <Field.Label>이메일</Field.Label>
        <Input
          required
          type="email"
          name="email"
          autoComplete="email"
          value={profile.email}
          onChange={(event) => setProfile({ ...profile, email: event.target.value })}
        />
        <Field.Description>업무 알림을 받을 이메일 주소입니다.</Field.Description>
      </Field.Root>
      <Field.Root>
        <Field.Label>이메일 알림</Field.Label>
        <Switch
          checked={profile.notifications}
          onCheckedChange={(notifications) => {
            setProfile({ ...profile, notifications });
            setMessage('');
          }}
        />
        <Field.Description>담당 업무의 변경 사항을 받아봅니다.</Field.Description>
      </Field.Root>
      <div className="city-block-actions city-block-actions--separated">
        <Button type="submit" disabled={!dirty}>
          변경 사항 저장
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!dirty}
          onClick={() => {
            setProfile(saved);
            setMessage('변경 사항을 되돌렸습니다.');
          }}
        >
          취소
        </Button>
      </div>
      <output className="city-block-status" aria-live="polite">
        {message}
      </output>
    </form>
  );
}
