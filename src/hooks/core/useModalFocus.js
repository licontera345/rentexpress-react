import { useEffect, useRef } from 'react';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const useModalFocus = ({ isOpen, onClose, dialogRef, }) => {
  const lastFocusedElement = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    lastFocusedElement.current = document.activeElement;
    const dialogNode = dialogRef?.current;

    if (!dialogNode) {
      return () => {
        if (lastFocusedElement.current instanceof HTMLElement) {
          lastFocusedElement.current.focus();
        }
      };
    }

    const focusableElements = dialogNode.querySelectorAll(focusableSelector);
    const firstFocusable = focusableElements?.[0];
    const lastFocusable = focusableElements?.[focusableElements.length - 1];

    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      dialogNode.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab' || !focusableElements?.length) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    };

    dialogNode.addEventListener('keydown', handleKeyDown);

    return () => {
      dialogNode.removeEventListener('keydown', handleKeyDown);
      if (lastFocusedElement.current instanceof HTMLElement) {
        lastFocusedElement.current.focus();
      }
    };
  }, [isOpen, onClose, dialogRef]);
};

export default useModalFocus;
