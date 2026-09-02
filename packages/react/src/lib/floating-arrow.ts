import { cn } from './cn';

export const floatingArrowClasses = cn(
  'relative block h-1.5 w-3 overflow-clip',
  'data-[side=bottom]:-top-1.5',
  'data-[side=left]:-right-[9px] data-[side=left]:rotate-90',
  'data-[side=right]:-left-[9px] data-[side=right]:-rotate-90',
  'data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180',
  "before:absolute before:bottom-0 before:left-1/2 before:size-[8.5px] before:bg-current before:content-[''] before:[transform:translate(-50%,50%)_rotate(45deg)]",
);
