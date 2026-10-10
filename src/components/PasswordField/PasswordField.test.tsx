import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { PasswordField } from './PasswordField';

describe('PasswordField', () => {
  it('скрывает значение по умолчанию и показывает по кнопке', async () => {
    const user = userEvent.setup();
    render(<PasswordField label="Пароль" defaultValue="s3cret!" />);

    const input = screen.getByLabelText('Пароль');
    expect(input).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Показать пароль' }));

    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Скрыть пароль' })).toBeInTheDocument();
  });

  it('кнопка видимости не отправляет форму', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <PasswordField label="Пароль" />
        <button type="submit">Отправить</button>
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Показать пароль' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('type', 'text');
  });

  it('подставляет autoComplete="current-password" по умолчанию', () => {
    render(<PasswordField label="Пароль" />);
    expect(screen.getByLabelText('Пароль')).toHaveAttribute('autocomplete', 'current-password');
  });

  it('не имеет нарушений доступности', async () => {
    const { container } = render(<PasswordField label="Пароль" error="Минимум 8 символов" />);
    expect(screen.getByLabelText('Пароль')).toBeInvalid();
    expect(screen.getByRole('alert')).toHaveTextContent('Минимум 8 символов');
    expect((await axe(container)).violations).toHaveLength(0);
  });
});
