import type { Meta, StoryObj } from '@storybook/react-vite';
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
