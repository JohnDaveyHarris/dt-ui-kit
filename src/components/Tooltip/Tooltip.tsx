import {
  useEffect,
  useId,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react-dom';
import clsx from 'clsx';
import styles from './Tooltip.module.css';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

/** Пропсы, которые потребитель развешивает на триггер через render prop */
export interface TooltipTriggerProps {
  /**
   * Колбэк-ref триггера. Внутри - setState-функция: значение стабильно
   * и не содержит ref-механики библиотеки позиционирования.
   */
  ref: (node: HTMLElement | null) => void;
  /** Ставится только при открытии: битая ссылка на закрытый тултип - шум для скринридеров */
  'aria-describedby'?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (event: ReactKeyboardEvent) => void;
}

export interface TooltipProps {
  /** Содержимое подсказки */
  content: ReactNode;
  /** Триггер: пропсы из render prop вешаются на интерактивный элемент */
  children?: (props: TooltipTriggerProps) => ReactElement;
  /** Расположение относительно триггера */
  placement?: TooltipPlacement;
  /** Задержка показа при наведении, ms (по фокусу - мгновенно) */
  showDelay?: number;
  /** Начальное состояние - для документации и визуальных тестов */
  defaultOpen?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  showDelay = 150,
  defaultOpen = false,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [hoverPending, setHoverPending] = useState(false);
  // Оба DOM-узла - контролируемые: живут в состоянии, useFloating получает
  // их через elements-опцию. В компоненте нет ни одного значения,
  // производного от useRef - включая возвраты useFloating.
  // Интеграция с библиотекой сведена к
  // «состояние -> elements»: заменить библиотеку - одна строка.
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const [floatingEl, setFloatingEl] = useState<HTMLElement | null>(null);
  const tooltipId = useId();

  const { floatingStyles, isPositioned } = useFloating({
    placement,
    // fixed: устойчив к позиционированным предкам (в отличие от absolute)
    strategy: 'fixed',
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    // Пересчёт при скролле/резайзе/анимациях триггера
    whileElementsMounted: autoUpdate,
    elements: { reference: triggerEl, floating: floatingEl },
  });

  // Задержка показа по hover: таймер живёт в эффекте, cleanup отменяет
  // его при уходе курсора, blur и размонтировании
  useEffect(() => {
    if (!hoverPending || open) return;
    const timer = setTimeout(() => setOpen(true), showDelay);
    return () => clearTimeout(timer);
  }, [hoverPending, open, showDelay]);

  const triggerProps: TooltipTriggerProps = {
    ref: setTriggerEl,
    onMouseEnter: () => setHoverPending(true),
    onMouseLeave: () => {
      setHoverPending(false);
      setOpen(false);
    },
    // Фокус - без задержки: клавиатурный пользователь уже сделал движение табом
    onFocus: () => setOpen(true),
    // blur гасит и ожидающее наведение - иначе тултип воскрес бы
    // через showDelay, пока курсор всё ещё на триггере
    onBlur: () => {
      setOpen(false);
      setHoverPending(false);
    },
    onKeyDown: (event) => {
      if (event.key === 'Escape' && open) {
        // Escape закрывает только тултип, не родительские обработчики
        event.stopPropagation();
        setOpen(false);
      }
    },
    ...(open ? { 'aria-describedby': tooltipId } : {}),
  };

  return (
    <>
      {children?.(triggerProps)}
      {open && (
        <div
          ref={setFloatingEl}
          id={tooltipId}
          role="tooltip"
          className={clsx(styles.tooltip, className)}
          style={{
            ...floatingStyles,
            // До первого измерения позиция неизвестна - скрываем (каноничный
            // паттерн floating-ui против мигания в углу экрана)
            visibility: isPositioned ? 'visible' : 'hidden',
          }}
        >
          {content}
        </div>
      )}
    </>
  );
}
