import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
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

export const VisibilityInteraction: Story = {
  args: { label: 'Пароль', defaultValue: 's3cret!' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Пароль');

    await expect(input).toHaveAttribute('type', 'password');
    await userEvent.click(canvas.getByRole('button', { name: 'Показать пароль' }));
    await expect(input).toHaveAttribute('type', 'text');
    await expect(canvas.getByRole('button', { name: 'Скрыть пароль' })).toBeInTheDocument();
  },
};
