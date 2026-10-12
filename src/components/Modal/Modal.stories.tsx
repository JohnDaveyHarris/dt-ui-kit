import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: { onClose: fn() },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    title: 'Удалить элемент?',
    description: 'Действие нельзя отменить.',
    children: <p style={{ margin: 0 }}>Элемент «Отчёт за июнь» будет удалён безвозвратно.</p>,
    footer: (
      <>
        <Button variant="secondary">Отмена</Button>
        <Button>Удалить</Button>
      </>
    ),
  },
};

export const Small: Story = { args: { ...Open.args, size: 's' } };
export const Large: Story = { args: { ...Open.args, size: 'l' } };

export const NonDismissible: Story = {
  args: { ...Open.args, dismissible: false, title: 'Обязательное действие' },
};

export const LongContent: Story = {
  args: {
    open: true,
    title: 'Условия использования',
    children: (
      <div style={{ display: 'grid', gap: 8 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i} style={{ margin: 0 }}>
            Пункт {i + 1}. Текст условия…
          </p>
        ))}
      </div>
    ),
    footer: <Button>Принимаю</Button>,
  },
};

export const Interactive: Story = {
  args: { open: false, title: 'Подтверждение' },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Открыть модалку</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => {
            args.onClose?.();
            setOpen(false);
          }}
          description="Вы уверены, что хотите удалить этот элемент?"
        >
          <p style={{ margin: 0 }}>Действие нельзя отменить.</p>
        </Modal>
      </>
    );
  },
};

export const CloseInteraction: Story = {
  args: { open: true, title: 'Подтверждение' },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Открыть</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <p style={{ margin: 0 }}>Закройте модалку кнопкой ✕.</p>
        </Modal>
      </>
    );
  },
  // Синтетические клики userEvent работают отлично - проверяем путь ✕ в браузере.
  // Настоящий Escape в play недостижим: он требует доверенного ввода (см. e2e/modal.spec.ts).
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // findByRole (в отличие от getByRole) переспрашивает дерево до 1с:
    // диалог становится доступным после useEffect с showModal()
    const dialog = await canvas.findByRole('dialog', { name: 'Подтверждение' });

    await expect(dialog).toHaveAttribute('open');
    await userEvent.click(canvas.getByRole('button', { name: 'Закрыть' }));
    await expect(dialog).not.toHaveAttribute('open');
  },
};
