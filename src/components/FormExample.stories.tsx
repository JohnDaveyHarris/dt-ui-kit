import { useState, type SubmitEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button/Button';
import { TextField } from './TextField/TextField';
import { TextArea } from './TextArea/TextArea';
import { Select } from './Select/Select';
import { Checkbox } from './Checkbox/Checkbox';

function FeedbackForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes('@')) {
      setEmailError('Похоже, в адресе нет символа @');
      return;
    }
    setEmailError(undefined);
    setSubmitted(true);
  }

  if (submitted) return <p role="status">Спасибо! Форма отправлена 🎉</p>;

  return (
    <form style={{ display: 'grid', gap: 16, maxWidth: 360 }} onSubmit={handleSubmit} noValidate>
      <TextField
        label="Email"
        name="email"
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={emailError}
      />
      <Select
        label="Тема"
        name="topic"
        defaultValue="question"
        options={[
          { value: 'question', label: 'Вопрос' },
          { value: 'bug', label: 'Баг' },
          { value: 'idea', label: 'Идея' },
        ]}
      />
      <TextArea label="Сообщение" name="message" placeholder="Опишите подробно…" />
      <Checkbox label="Я согласен с обработкой данных" name="consent" required />
      <Button type="submit">Отправить</Button>
    </form>
  );
}

const meta: Meta = {
  title: 'Recipes/Feedback form',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <FeedbackForm /> };
