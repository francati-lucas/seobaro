import React from 'react';
import { createPortal } from 'react-dom';

function getFocusable(root) {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll(
      [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(',')
    )
  );
}

export default function Modal({ open, title, children, onClose, size = 'md', ariaLabel }) {
  const panelRef = React.useRef(null);
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  });

  React.useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (e.key !== 'Tab') return;
      const focusable = getFocusable(panelRef.current);
      if (focusable.length === 0) return;

      const active = document.activeElement;
      const currentIdx = focusable.indexOf(active);
      const nextIdx = e.shiftKey ? currentIdx - 1 : currentIdx + 1;

      if (e.shiftKey && (currentIdx <= 0 || currentIdx === -1)) {
        e.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!e.shiftKey && (currentIdx === focusable.length - 1 || currentIdx === -1)) {
        e.preventDefault();
        focusable[0].focus();
      } else if (currentIdx !== -1) {
        // deixa o browser fazer o comportamento padrão
      } else {
        e.preventDefault();
        focusable[0].focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const t = window.setTimeout(() => {
      const focusable = getFocusable(panelRef.current);
      (focusable[0] || panelRef.current)?.focus?.();
    }, 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="sb-modal" role="dialog" aria-modal="true" aria-label={ariaLabel || title || 'Modal'}>
      <button type="button" className="sb-modal__overlay" onClick={onClose} aria-label="Fechar" />
      <div className={`sb-modal__panel sb-modal__panel--${size}`} ref={panelRef} tabIndex={-1}>
        <div className="sb-modal__header">
          <h3 className="sb-modal__title">{title}</h3>
          <button type="button" className="sb-modal__close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>
        <div className="sb-modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
}

