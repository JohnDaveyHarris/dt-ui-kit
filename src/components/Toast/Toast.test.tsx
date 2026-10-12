import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Toaster } from './Toast';
import { dismissAll, dismissToast, toast } from './toastManager';
import styles from './Toaster.module.css';

describe('Toast', () => {
  beforeEach(() => dismissAll());
  afterEach(() => vi.useRealTimers());

  it('живая область присутствует в DOM даже без уведомлений', () => {
    render(<Toaster />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('показывает уведомление по императивному вызову', () => {
    render(<Toaster />);
    act(() => toast('Сохранено'));
    expect(screen.getByText('Сохранено')).toBeInTheDocument();
  });

  it('toast.success / toast.error задают вариант', () => {
    render(<Toaster />);
    act(() => {
      toast.success('Готово');
      toast.error('Ошибка');
    });
    expect(screen.getByText('Готово').parentElement).toHaveClass(styles.success);
    expect(screen.getByText('Ошибка').parentElement).toHaveClass(styles.danger);
  });

  it('закрывается по кнопке', async () => {
    const user = userEvent.setup();
    render(<Toaster />);
    act(() => toast('Закрываемый'));

    await user.click(screen.getByRole('button', { name: 'Закрыть уведомление' }));

    expect(screen.queryByText('Закрываемый')).not.toBeInTheDocument();
  });

  it('dismiss закрывает по id', () => {
    render(<Toaster />);
    let id = 0;
    act(() => {
      id = toast('По id');
    });

    act(() => dismissToast(id));

    expect(screen.queryByText('По id')).not.toBeInTheDocument();
  });

  it('авто-закрытие по таймеру', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => toast('Временное', { duration: 1000 }));

    act(() => vi.advanceTimersByTime(999));
    expect(screen.getByText('Временное')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByText('Временное')).not.toBeInTheDocument();
  });

  it('duration: Infinity отключает авто-закрытие', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => toast('Постоянное', { duration: Infinity }));

    act(() => vi.advanceTimersByTime(60_000));

    expect(screen.getByText('Постоянное')).toBeInTheDocument();
  });

  it('пауза на hover, возобновление после ухода', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => toast('Наведи', { duration: 1000 }));

    fireEvent.mouseEnter(screen.getByText('Наведи'));
    act(() => vi.advanceTimersByTime(10_000));
    expect(screen.getByText('Наведи')).toBeInTheDocument(); // пауза держит

    fireEvent.mouseLeave(screen.getByText('Наведи'));
    act(() => vi.advanceTimersByTime(1_000));
    expect(screen.queryByText('Наведи')).not.toBeInTheDocument();
  });

  it('лимит очереди: старейшие вытесняются', () => {
    render(<Toaster />);
    act(() => {
      for (let i = 0; i < 8; i += 1) toast(`Тост ${i}`);
    });

    expect(screen.getAllByText(/^Тост /)).toHaveLength(5);
    expect(screen.queryByText('Тост 0')).not.toBeInTheDocument();
    expect(screen.getByText('Тост 7')).toBeInTheDocument();
  });

  it('не имеет нарушений доступности', async () => {
    const { container } = render(<Toaster />);
    act(() => toast('Доступность'));
    expect((await axe(container)).violations).toHaveLength(0);
  });
});
