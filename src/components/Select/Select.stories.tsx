import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'question', label: 'Вопрос' },
  { value: 'bug', label: 'Ошибка' },
  { value: 'idea', label: 'Предложение' },
];

export const Default: Story = {
  args: { label: 'Тема обращения', options, placeholder: 'Выберите тему' },
};

export const WithValue: Story = {
  args: { label: 'Тема обращения', options, defaultValue: 'bug' },
};

export const WithError: Story = {
  args: { label: 'Тема обращения', options, error: 'Выберите тему из списка' },
};

export const WithDisabledOption: Story = {
  args: {
    label: 'Тема обращения',
    defaultValue: 'question',
    options: [...options, { value: 'other', label: 'Другое (скоро)', disabled: true }],
  },
};
