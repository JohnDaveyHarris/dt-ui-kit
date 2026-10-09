import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: 'Email', placeholder: 'name@example.com' } };
export const WithHint: Story = {
  args: { label: 'Пароль', type: 'password', hint: 'Минимум 8 символов' },
};
export const WithError: Story = {
  args: { label: 'Email', defaultValue: 'not-an-email', error: 'Некорректный email' },
};
