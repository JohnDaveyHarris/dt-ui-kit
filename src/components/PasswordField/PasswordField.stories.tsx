import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordField } from './PasswordField';

const meta = {
  title: 'Components/PasswordField',
  component: PasswordField,
  tags: ['autodocs'],
} satisfies Meta<typeof PasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Пароль', placeholder: '••••••••' },
};
export const WithHint: Story = {
  args: { label: 'Новый пароль', hint: 'Минимум 8 символов', autoComplete: 'new-password' },
};
export const WithError: Story = {
  args: { label: 'Пароль', defaultValue: '123', error: 'Минимум 8 символов' },
};
export const WithoutToggle: Story = {
  args: { label: 'Повторите пароль', showVisibilityToggle: false },
};
