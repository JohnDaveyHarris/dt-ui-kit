import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { TextField } from './TextField';

describe('TextField', () => {
  it('связывает label с input и анонсирует ошибку', async () => {
    const { container } = render(<TextField label="Email" error="Некорректный email" />);

    expect(screen.getByLabelText('Email')).toBeInvalid();
    expect(screen.getByRole('alert')).toHaveTextContent('Некорректный email');
    expect((await axe(container)).violations).toHaveLength(0);
  });
});
