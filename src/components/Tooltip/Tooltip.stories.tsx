import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'radio', options: ['top', 'right', 'bottom', 'left'] },
    children: { control: false }, // render prop — не сериализуется
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { content: 'Сохранить черновик' },
  render: (args) => (
    <Tooltip {...args}>{(trigger) => <Button {...trigger}>Сохранить</Button>}</Tooltip>
  ),
};

export const AllPlacements: Story = {
  args: { content: 'Подсказка' },
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gap: 48,
        gridTemplateColumns: 'repeat(2, auto)',
        justifyItems: 'center',
        padding: 40,
      }}
    >
      {(['top', 'right', 'bottom', 'left'] as const).map((placement) => (
        <Tooltip
          key={placement}
          // args.content — общий текст всех четырёх: Controls влияют на все сразу
          content={`${args.content} ${placement}`}
          placement={placement}
        >
          {(trigger) => (
            <Button variant="secondary" {...trigger}>
              {placement}
            </Button>
          )}
        </Tooltip>
      ))}
    </div>
  ),
};

export const OnTruncatedText: Story = {
  args: { content: 'Полное название: quarterly-report-final-v2.pdf' },
  render: (args) => (
    <Tooltip {...args}>
      {(trigger) => (
        <Button variant="secondary" {...trigger} style={{ maxWidth: 150 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            quarterly-report-final-v2.pdf
          </span>
        </Button>
      )}
    </Tooltip>
  ),
};

export const Visible: Story = {
  args: { content: 'Сохранить черновик', defaultOpen: true },
  render: (args) => (
    <div style={{ padding: 60 }}>
      <Tooltip {...args}>{(trigger) => <Button {...trigger}>Сохранить</Button>}</Tooltip>
    </div>
  ),
};

export const HoverInteraction: Story = {
  args: { content: 'Подсказка', showDelay: 0 },
  render: (args) => (
    <Tooltip {...args}>{(trigger) => <Button {...trigger}>Наведи на меня</Button>}</Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Наведи на меня' });

    await userEvent.hover(trigger);
    await waitFor(() => expect(canvas.getByRole('tooltip')).toBeInTheDocument());
    await expect(trigger).toHaveAttribute('aria-describedby', canvas.getByRole('tooltip').id);

    await userEvent.unhover(trigger);
    await waitFor(() => expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument());
  },
};

export const EscapeInteraction: Story = {
  args: { content: 'Подсказка', defaultOpen: true },
  render: (args) => (
    <Tooltip {...args}>{(trigger) => <Button {...trigger}>Сохранить</Button>}</Tooltip>
  ),
  // React onKeyDown — синтетические события его вызывают.
  // Это контраст с <dialog>: там Escape — default action браузера,
  // требующий доверенного ввода, поэтому он живёт в e2e.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Сохранить' });

    await expect(canvas.getByRole('tooltip')).toBeInTheDocument();
    trigger.focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument());
  },
};
