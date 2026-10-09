import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggleDemo } from './ThemeToggleDemo';

const meta = {
  title: 'Recipes/Theme toggle',
  component: ThemeToggleDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggleDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
