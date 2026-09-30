import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tabs } from '../../src/components/tabs';

describe('Tabs', () => {
  it('activates tabs with keyboard navigation when activateOnFocus is enabled', async () => {
    const user = userEvent.setup();

    render(
      <Tabs.Root defaultValue="overview">
        <Tabs.List activateOnFocus>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="activity">Activity</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="activity">Activity panel</Tabs.Panel>
      </Tabs.Root>,
    );

    const overview = screen.getByRole('tab', { name: 'Overview' });
    overview.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });

  it('propagates compact density through tabs and panels', () => {
    render(
      <Tabs.Root defaultValue="overview" density="compact">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="activity">Activity</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="activity">Activity panel</Tabs.Panel>
      </Tabs.Root>,
    );

    const tablist = screen.getByRole('tablist');
    const selectedTab = screen.getByRole('tab', { name: 'Overview' });
    const panel = screen.getByRole('tabpanel');

    expect(tablist).toHaveAttribute('data-city-density', 'compact');
    expect(tablist).toHaveClass('h-(--city-control-sm)', 'gap-0.5', 'p-0.5');
    expect(selectedTab).toHaveAttribute('data-city-density', 'compact');
    expect(selectedTab).toHaveClass('h-6', 'text-xs');
    expect(panel).toHaveAttribute('data-city-density', 'compact');
    expect(panel).toHaveClass('mt-2', 'text-xs');
  });
});
