import { act, fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Tooltip } from './Tooltip';

// Хелпер сам подставляет content, поэтому исключаем его из типа пропсов
function renderTooltip(props: Omit<Parameters<typeof Tooltip>[0], 'content'> = {}) {
  return render(
    <Tooltip content="Подсказка" {...props}>
      {(trigger) => (
        <button type="button" {...trigger}>
          Действие
        </button>
      )}
    </Tooltip>,
  );
}

// Роль "tooltip" доступна только когда тултип в DOM И видим (не visibility:hidden).
// В jsdom floating-ui вычисляет позицию асинхронно (микротаск после рендера),
// до этого anti-flash паттерн держит тултип скрытым. Поэтому:
// — факт монтирования проверяем по DOM (querySelector не зависит от видимости);
// — доступность (роль, aria-describedby) — через findByRole с реальными таймерами.
const getTooltipNode = () => document.querySelector('[role="tooltip"]');

describe('Tooltip', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('по умолчанию скрыт', () => {
    renderTooltip();
    expect(getTooltipNode()).not.toBeInTheDocument();
  });

  it('показывается по hover после задержки', async () => {
    vi.useFakeTimers();
    renderTooltip();
    const trigger = screen.getByRole('button', { name: 'Действие' });

    fireEvent.mouseEnter(trigger);
    expect(getTooltipNode()).not.toBeInTheDocument(); // задержка держится

    act(() => vi.advanceTimersByTime(150)); // срок вышел → монтирование
    expect(getTooltipNode()).toBeInTheDocument();

    vi.useRealTimers();
    await screen.findByRole('tooltip'); // позиционирование отработало → роль доступна
  });

  it('показывается по фокусу мгновенно', async () => {
    renderTooltip();
    fireEvent.focus(screen.getByRole('button', { name: 'Действие' }));

    expect(getTooltipNode()).toBeInTheDocument(); // монтируется синхронно
    await screen.findByRole('tooltip'); // и становится доступным после позиционирования
  });

  it('скрывается по mouseLeave и blur', () => {
    vi.useFakeTimers();
    renderTooltip();
    const trigger = screen.getByRole('button', { name: 'Действие' });

    fireEvent.mouseEnter(trigger);
    act(() => vi.advanceTimersByTime(150));
    expect(getTooltipNode()).toBeInTheDocument();

    fireEvent.mouseLeave(trigger);
    expect(getTooltipNode()).not.toBeInTheDocument();

    fireEvent.mouseEnter(trigger);
    act(() => vi.advanceTimersByTime(150));
    expect(getTooltipNode()).toBeInTheDocument();

    fireEvent.blur(trigger);
    expect(getTooltipNode()).not.toBeInTheDocument();
  });

  it('закрывается по Escape', async () => {
    renderTooltip({ defaultOpen: true });
    const trigger = screen.getByRole('button', { name: 'Действие' });

    await screen.findByRole('tooltip'); // открыт и доступен
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('связывает триггер с тултипом через aria-describedby (при открытии)', async () => {
    renderTooltip({ defaultOpen: true });
    const tooltip = await screen.findByRole('tooltip');

    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('не ставит aria-describedby на закрытый тултип', () => {
    renderTooltip();
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
  });

  it('не имеет нарушений доступности (открытый и закрытый)', async () => {
    const closed = renderTooltip();
    expect((await axe(closed.container)).violations).toHaveLength(0);

    const open = renderTooltip({ defaultOpen: true });
    expect((await axe(open.container)).violations).toHaveLength(0);
  });
});
