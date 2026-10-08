import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'radio', options: ['s', 'm', 'l'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { children: 'Сохранить' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Отмена' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Подробнее' } };
export const Loading: Story = { args: { children: 'Загрузка…', loading: true } };
export const Disabled: Story = { args: { children: 'Недоступно', disabled: true } };