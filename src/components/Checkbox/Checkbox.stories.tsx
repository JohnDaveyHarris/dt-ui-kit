import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Я согласен с условиями' },
};

export const Checked: Story = {
  args: { label: 'Подписаться на рассылку', defaultChecked: true },
};

export const WithHint: Story = {
  args: {
    label: 'Я согласен с обработкой персональных данных',
    hint: 'Подробнее — в политике конфиденциальности',
  },
};

export const WithError: Story = {
  args: {
    label: 'Я согласен с условиями',
    error: 'Без согласия мы не сможем продолжить',
  },
};

export const WithRichLabel: Story = {
  args: {
    label: (
      <>
        Я согласен с <a href="#terms">условиями использования</a>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: { label: 'Недоступный пункт', disabled: true },
};
