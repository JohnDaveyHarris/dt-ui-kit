import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('по умолчанию закрыта - без атрибута open', () => {
    render(<Modal open={false} onClose={() => {}} title="Подтверждение" />);
    const dialog = document.querySelector('dialog');
    expect(dialog).not.toBeNull();
    expect(dialog).not.toHaveAttribute('open');
  });

  it('открывается как модальный диалог и связан с заголовком', () => {
    render(<Modal open onClose={() => {}} title="Подтверждение" description="Описание" />);

    const dialog = screen.getByRole('dialog', { name: 'Подтверждение' });
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByText('Описание')).toBeInTheDocument();
  });

  it('кнопка ✕ вызывает onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="Подтверждение" />);

    await user.click(screen.getByRole('button', { name: 'Закрыть' }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('клик по фону вызывает onClose, клик по контенту - нет', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Подтверждение">
        <button type="button">Внутри</button>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');

    // target === dialog -> клик пришёлся на фон, а не на содержимое
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledOnce();

    onClose.mockClear();
    fireEvent.click(screen.getByRole('button', { name: 'Внутри' }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('Escape (cancel) вызывает onClose и не закрывает диалог нативно', () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="Подтверждение" />);
    const dialog = screen.getByRole('dialog') as HTMLDialogElement;

    act(() => {
      dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    });

    expect(onClose).toHaveBeenCalledOnce();
    expect(dialog.open).toBe(true);
  });

  it('нативное закрытие диалога синхронизирует состояние (close)', () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="Подтверждение" />);
    const dialog = screen.getByRole('dialog') as HTMLDialogElement;

    act(() => {
      dialog.close();
    });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('блокирует скролл body на время открытия', () => {
    const { rerender } = render(<Modal open onClose={() => {}} title="Подтверждение" />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<Modal open={false} onClose={() => {}} title="Подтверждение" />);
    expect(document.body.style.overflow).toBe('');
  });

  it('не имеет нарушений доступности', async () => {
    const { container } = render(
      <Modal open onClose={() => {}} title="Подтверждение" description="Описание">
        <p>Содержимое</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: 'Подтверждение' })).toBeInTheDocument();
    expect((await axe(container)).violations).toHaveLength(0);
  });
});
