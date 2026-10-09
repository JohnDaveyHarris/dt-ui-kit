import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from './TextArea';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Комментарий', placeholder: 'Напишите что-нибудь…' },
};

export const WithHint: Story = {
  args: { label: 'Сообщение', hint: 'До 500 символов', placeholder: 'Опишите подробно…' },
};

export const WithError: Story = {
  args: {
    label: 'Сообщение',
    defaultValue: 'коротко',
    error: 'Описание должно содержать минимум 20 символов',
  },
};

export const Disabled: Story = {
  args: { label: 'Комментарий', defaultValue: 'Недоступно для редактирования', disabled: true },
};
