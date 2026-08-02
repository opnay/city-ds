import { Plus } from 'lucide-react';
import { Button } from '@opnay/city-ds-react/button';

const sizes = ['sm', 'md', 'lg'] as const;

export default function ButtonSizesExample() {
  return (
    <div className="city-docs-example-stack">
      <div className="city-docs-example-row">
        {sizes.map((size) => (
          <Button key={size} size={size} type="button">
            {size} 버튼
          </Button>
        ))}
      </div>
      <div className="city-docs-example-row">
        {sizes.map((size) => (
          <Button aria-label={`${size} 항목 추가`} iconOnly key={size} size={size} type="button">
            <Plus aria-hidden="true" />
          </Button>
        ))}
      </div>
    </div>
  );
}
