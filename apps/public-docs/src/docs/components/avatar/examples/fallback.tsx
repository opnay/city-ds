import { Avatar } from '@opnay/city-ds-react/avatar';

export default function AvatarFallbackExample() {
  return (
    <Avatar.Root shape="square">
      <Avatar.Image alt="불러오지 못한 프로필 사진" src="data:image/png;base64,invalid" />
      <Avatar.Fallback>IS</Avatar.Fallback>
    </Avatar.Root>
  );
}
