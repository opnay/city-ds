import type { Meta, StoryObj } from '@storybook/react-vite';
import { Combobox, Field, type ControlSize } from '@city-ds/react';

const projects = ['Civic Portal', 'Transit Map', 'Permit Tracker', 'Budget Explorer'];
const owners = ['Ari Kim', 'Bo Park', 'Casey Lee', 'Dana Cho'];

const meta = {
  title: 'Forms/Combobox',
  component: Combobox.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Combobox.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function ProjectCombobox({
  disabled = false,
  size = 'md',
}: {
  disabled?: boolean;
  size?: ControlSize;
}) {
  return (
    <Field.Root>
      <Combobox.Root
        items={projects}
        defaultValue="Transit Map"
        disabled={disabled}
        size={size}
      >
        <Field.Label>Project</Field.Label>
        <Combobox.InputGroup className="w-72">
          <Combobox.Input placeholder="Search projects" />
          <Combobox.Clear />
          <Combobox.Trigger />
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.Empty>No projects found.</Combobox.Empty>
              <Combobox.List>
                {(project: string) => (
                  <Combobox.Item key={project} value={project}>
                    <Combobox.ItemIndicator />
                    {project}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Field.Root>
  );
}

export const Default: Story = {
  render: () => <ProjectCombobox />,
};

export const Disabled: Story = {
  render: () => <ProjectCombobox disabled />,
};

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-3">
      <ProjectCombobox size="sm" />
      <ProjectCombobox size="md" />
      <ProjectCombobox size="lg" />
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <Field.Root invalid>
      <Combobox.Root items={projects}>
        <Field.Label>Project</Field.Label>
        <Combobox.InputGroup className="w-72">
          <Combobox.Input placeholder="Search projects" />
          <Combobox.Trigger />
        </Combobox.InputGroup>
        <Field.Error match>Select an active project.</Field.Error>
      </Combobox.Root>
    </Field.Root>
  ),
};

export const EmptyResults: Story = {
  render: () => (
    <Field.Root>
      <Combobox.Root items={projects} defaultInputValue="zzz">
        <Field.Label>Project</Field.Label>
        <Combobox.InputGroup className="w-72">
          <Combobox.Input placeholder="Search projects" />
          <Combobox.Trigger />
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.Empty>No projects found.</Combobox.Empty>
              <Combobox.List>
                {(project: string) => (
                  <Combobox.Item key={project} value={project}>
                    {project}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Field.Root>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Field.Root>
      <Combobox.Root items={owners} multiple defaultValue={['Ari Kim', 'Dana Cho']}>
        <Field.Label>Owners</Field.Label>
        <Combobox.InputGroup className="w-80 flex-col items-stretch gap-1.5 py-2">
          <Combobox.Chips>
            <Combobox.Value>
              {(selectedOwners: string[]) =>
                selectedOwners.map((owner) => (
                  <Combobox.Chip key={owner}>
                    {owner}
                    <Combobox.ChipRemove aria-label={`Remove ${owner}`} />
                  </Combobox.Chip>
                ))
              }
            </Combobox.Value>
          </Combobox.Chips>
          <div className="flex w-full min-w-0 items-center gap-2">
            <Combobox.Input placeholder="Add owner" />
            <Combobox.Clear />
            <Combobox.Trigger />
          </div>
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.List>
                {(owner: string) => (
                  <Combobox.Item key={owner} value={owner}>
                    <Combobox.ItemIndicator />
                    {owner}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Field.Root>
  ),
};
