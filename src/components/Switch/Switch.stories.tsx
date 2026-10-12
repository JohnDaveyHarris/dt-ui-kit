import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: { label: 'Уведомления по email' },
};

export const On: Story = {
  args: { label: 'Уведомления по email', defaultChecked: true },
};

export const WithHint: Story = {
  args: { label: 'Тёмная тема', hint: 'Применяется мгновенно' },
};

export const WithError: Story = {
  args: { label: 'Публичный профиль', error: 'Недоступно на вашем тарифе' },
};

export const Disabled: Story = {
  args: { label: 'Автоплатёж', disabled: true },
};

export const DisabledChecked: Story = {
  args: { label: 'Автоплатёж', defaultChecked: true, disabled: true },
};

export const ToggleInteraction: Story = {
  args: { label: 'Уведомления по email' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch', { name: 'Уведомления по email' });

    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};
