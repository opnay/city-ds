import { Input, InputGroup } from '@opnay/city-ds-react/input';

export default function InputAddonsExample() {
  return (
    <InputGroup.Root>
      <InputGroup.Addon>https://</InputGroup.Addon>
      <Input aria-label="주소" placeholder="example.com" />
      <InputGroup.Addon position="trailing">.gov</InputGroup.Addon>
    </InputGroup.Root>
  );
}
