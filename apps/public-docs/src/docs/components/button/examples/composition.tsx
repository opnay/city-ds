import { ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@opnay/city-ds-react/button';

export default function ButtonCompositionExample() {
  return (
    <div className="city-docs-example-row">
      <Button disabled type="button" variant="primary">
        저장할 수 없음
      </Button>
      <Button
        nativeButton={false}
        render={<Link to="/getting-started" />}
        role="link"
        variant="outline"
      >
        시작하기로 이동
        <ArrowRight aria-hidden="true" size={16} />
      </Button>
    </div>
  );
}
