import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('доступен как switch и переключается кликом', async () => {
    const user = userEvent.setup();
    render(<Switch label="Уведомления" />);

    const toggle = screen.getByRole('switch', { name: 'Уведомления' });
    expect(toggle).not.toBeChecked();

    await user.click(toggle);
    expect(toggle).toBeChecked();
  });

  it('переключается с клавиатуры (Space)', async () => {
    const user = userEvent.setup();
    render(<Switch label="Уведомления" />);

    const toggle = screen.getByRole('switch', { name: 'Уведомления' });
    toggle.focus();

    await user.keyboard('[Space]');
    expect(toggle).toBeChecked();

    await user.keyboard('[Space]');
    expect(toggle).not.toBeChecked();
  });

  it('не переключается в состоянии disabled', async () => {
    const user = userEvent.setup();
    render(<Switch label="Уведомления" disabled />);

    const toggle = screen.getByRole('switch', { name: 'Уведомления' });
    await user.click(toggle);

    expect(toggle).toBeDisabled();
    expect(toggle).not.toBeChecked();
  });

  it('не имеет нарушений доступности (в обоих состояниях)', async () => {
    const off = render(<Switch label="Уведомления" hint="Раз в день" />);
    expect((await axe(off.container)).violations).toHaveLength(0);

    const on = render(<Switch label="Уведомления" defaultChecked />);
    expect((await axe(on.container)).violations).toHaveLength(0);
  });
});
