import { Plus } from 'lucide-react';
import { Button, type ButtonProps } from '@opnay/city-ds-react/button';

type ButtonPlaygroundExampleProps = Partial<
  Pick<ButtonProps, 'disabled' | 'iconOnly' | 'size' | 'variant'>
>;

export default function ButtonPlaygroundExample({
  disabled = false,
  iconOnly = false,
  size = 'md',
  variant = 'primary',
}: ButtonPlaygroundExampleProps = {}) {
  return (
    <Button
      aria-label="미리보기 버튼"
      disabled={disabled}
      iconOnly={iconOnly}
      size={size}
      type="button"
      variant={variant}
    >
      {iconOnly ? <Plus aria-hidden="true" /> : '미리보기 버튼'}
    </Button>
  );
}
