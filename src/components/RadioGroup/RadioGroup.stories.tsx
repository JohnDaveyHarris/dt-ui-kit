import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, Radio } from './RadioGroup';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'radio', options: ['row', 'column'] },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Общие радио-кнопки для всех стори
function Radios() {
  return (
    <>
      <Radio value="courier" label="Курьером" />
      <Radio value="pickup" label="Пункт выдачи" />
      <Radio value="post" label="Почта" />
    </>
  );
}

export const Default: Story = {
  args: { name: 'delivery', label: 'Способ доставки' },
  render: (args) => (
    <RadioGroup {...args}>
      <Radios />
    </RadioGroup>
  ),
};

export const Row: Story = {
  args: { name: 'delivery', label: 'Способ доставки', direction: 'row' },
  render: (args) => (
    <RadioGroup {...args}>
      <Radios />
    </RadioGroup>
  ),
};

export const WithHint: Story = {
  args: {
    name: 'delivery',
    label: 'Способ доставки',
    hint: 'Стоимость рассчитается на следующем шаге',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radios />
    </RadioGroup>
  ),
};

export const WithError: Story = {
  args: { name: 'delivery', label: 'Способ доставки', error: 'Выберите способ доставки' },
  render: (args) => (
    <RadioGroup {...args}>
      <Radios />
    </RadioGroup>
  ),
};

export const Interactive: Story = {
  args: { name: 'delivery', label: 'Способ доставки' },
  render: (args) => {
    // RadioGroup — контролируемый: без value/onChange клики ни к чему не приведут.
    // Держим состояние прямо в стори - и компонент оживает.
    const [value, setValue] = useState<string>('courier');
    return (
      <RadioGroup {...args} value={value} onChange={setValue}>
        <Radios />
      </RadioGroup>
    );
  },
};
