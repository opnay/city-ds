import { Avatar } from '@opnay/city-ds-react/avatar';

const avatarImage =
  'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2080%2080%22%3E%3Crect%20width%3D%2280%22%20height%3D%2280%22%20fill%3D%22%23181818%22%2F%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2230%22%20r%3D%2213%22%20fill%3D%22%23f7f7f7%22%2F%3E%3Cpath%20d%3D%22M20%2064c4-14%2036-14%2040%200%22%20fill%3D%22%23f7f7f7%22%2F%3E%3C%2Fsvg%3E';

export default function AvatarUsageExample() {
  return (
    <Avatar.Root>
      <Avatar.Image alt="김인섭의 프로필 사진" src={avatarImage} />
      <Avatar.Fallback>IS</Avatar.Fallback>
    </Avatar.Root>
  );
}
