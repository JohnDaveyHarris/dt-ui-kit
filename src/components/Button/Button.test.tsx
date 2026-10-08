import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('вызывает onClick при клике', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Сохранить</Button>);

    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('блокируется в состоянии loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Сохранить</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('не имеет нарушений доступности', async () => {
    const { container } = render(<Button>Ок</Button>);
    expect((await axe(container)).violations).toHaveLength(0);
  });
});