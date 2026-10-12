import { useLayoutEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from './toastManager';
import { Toaster } from './Toast';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  tags: ['autodocs'],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Demo: Story = {
  render: () => (
    <>
      <Toaster />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={() => toast('Сохранено')}>
          Info
        </Button>
        <Button variant="secondary" onClick={() => toast.success('Файл загружен')}>
          Success
        </Button>
        <Button variant="secondary" onClick={() => toast.error('Не удалось сохранить')}>
          Error
        </Button>
        <Button variant="secondary" onClick={() => toast('Только вручную', { duration: Infinity })}>
          Persistent
        </Button>
      </div>
    </>
  ),
};

function StaticToasts() {
  useLayoutEffect(() => {
    const ids = [
      toast.success('Файл загружен', { duration: Infinity }),
      toast.error('Не удалось сохранить черновик', { duration: Infinity }),
    ];
    return () => ids.forEach((id) => toast.dismiss(id));
  }, []);
  return <Toaster />;
}

export const Visible: Story = { render: () => <StaticToasts /> };
