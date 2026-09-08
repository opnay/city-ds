'use client';

import * as React from 'react';
import { useRender } from '@base-ui/react/use-render';
import { cn } from '../../lib/cn';
import type { Density } from '../../types';
import { useDensity } from '../density-provider';

interface DataListContextValue {
  orientation: 'horizontal' | 'vertical';
  density: Density;
  dividers: boolean;
}

const DataListContext = React.createContext<DataListContextValue>({
  orientation: 'horizontal',
  density: 'comfortable',
  dividers: false,
});

export interface DataListRootProps extends Omit<useRender.ComponentProps<'dl'>, 'className'> {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  density?: Density;
  dividers?: boolean;
}

export const DataListRoot = React.forwardRef<HTMLDListElement, DataListRootProps>(
  function DataListRoot(
    {
      orientation = 'horizontal',
      density: densityProp,
      dividers = false,
      className,
      render,
      ...props
    },
    ref,
  ) {
    const density = useDensity(densityProp);
    const context = React.useMemo(
      () => ({ orientation, density, dividers }),
      [orientation, density, dividers],
    );
    const element = useRender({
      defaultTagName: 'dl',
      ref,
      render,
      props: {
        ...props,
        className: cn(
          '@container/city-data-list m-0 min-w-0 text-sm text-city-foreground',
          className,
        ),
        'data-city-data-list': '',
        'data-orientation': orientation,
        'data-city-density': density,
        'data-dividers': dividers ? '' : undefined,
      },
    });
    return <DataListContext.Provider value={context}>{element}</DataListContext.Provider>;
  },
);

export interface DataListItemProps extends Omit<useRender.ComponentProps<'div'>, 'className'> {
  className?: string;
}

export const DataListItem = React.forwardRef<HTMLDivElement, DataListItemProps>(
  function DataListItem({ className, render, ...props }, ref) {
    const { orientation, density, dividers } = React.useContext(DataListContext);
    return useRender({
      defaultTagName: 'div',
      ref,
      render,
      props: {
        ...props,
        className: cn(
          'grid min-w-0 grid-cols-1 items-start gap-x-4 gap-y-1 first:pt-0 last:pb-0',
          orientation === 'horizontal' &&
            '@min-[24rem]/city-data-list:grid-cols-[minmax(0,var(--city-data-list-label-width,10rem))_minmax(0,1fr)]',
          density === 'compact' ? 'py-2' : 'py-3',
          dividers && 'not-first:border-t border-city-border',
          className,
        ),
        'data-city-data-list-item': '',
      },
    });
  },
);

export interface DataListLabelProps extends Omit<useRender.ComponentProps<'dt'>, 'className'> {
  className?: string;
}

export const DataListLabel = React.forwardRef<HTMLElement, DataListLabelProps>(
  function DataListLabel({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'dt',
      ref,
      render,
      props: {
        ...props,
        className: cn(
          'm-0 min-w-0 font-normal text-city-muted-foreground [overflow-wrap:anywhere]',
          className,
        ),
        'data-city-data-list-label': '',
      },
    });
  },
);

export interface DataListValueProps extends Omit<useRender.ComponentProps<'dd'>, 'className'> {
  className?: string;
}

export const DataListValue = React.forwardRef<HTMLElement, DataListValueProps>(
  function DataListValue({ className, render, ...props }, ref) {
    return useRender({
      defaultTagName: 'dd',
      ref,
      render,
      props: {
        ...props,
        className: cn('m-0 min-w-0 [overflow-wrap:anywhere]', className),
        'data-city-data-list-value': '',
      },
    });
  },
);

DataListRoot.displayName = 'DataList.Root';
DataListItem.displayName = 'DataList.Item';
DataListLabel.displayName = 'DataList.Label';
DataListValue.displayName = 'DataList.Value';

export const DataList = {
  Root: DataListRoot,
  Item: DataListItem,
  Label: DataListLabel,
  Value: DataListValue,
};
