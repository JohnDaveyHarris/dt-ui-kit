import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());

// --- Полифил <dialog> для jsdom ---
// jsdom парсит <dialog>, но не реализует show()/showModal()/close()
// (открытый issue jsdom#3294). Эмулируем минимально: атрибут open
// и событие close. Feature detection - при появлении нативной поддержки
// в jsdom полифил сам себя отключит.
if (typeof HTMLDialogElement !== 'undefined') {
  if (typeof HTMLDialogElement.prototype.show !== 'function') {
    HTMLDialogElement.prototype.show = function show(this: HTMLDialogElement) {
      if (!this.open) this.setAttribute('open', '');
    };
  }
  if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
    HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
      if (!this.open) this.setAttribute('open', '');
    };
  }
  if (typeof HTMLDialogElement.prototype.close !== 'function') {
    HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
      if (this.open) {
        this.removeAttribute('open');
        // Нативный close() стреляет событием close, на которое подписан
        // Modal - без этого тест «нативное закрытие синхронизирует
        // состояние» потерял бы смысл
        this.dispatchEvent(new Event('close'));
      }
    };
  }
}
