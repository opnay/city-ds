import { Avatar } from '@opnay/city-ds-react/avatar';

const sizes = ['sm', 'md', 'lg'] as const;

export default function AvatarSizesExample() {
  return (
    <div className="city-docs-avatar-row">
      {sizes.map((size) => (
        <Avatar.Root key={size} size={size}>
          <Avatar.Fallback>IS</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </div>
  );
}
