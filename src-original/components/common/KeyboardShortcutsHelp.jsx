import { useRef, useEffect } from 'react';
import { FiCommand } from 'react-icons/fi';
import { ModalHeader } from './layout/LayoutPrimitives';
import { MESSAGES } from '../../constants';
import useModalFocus from '../../hooks/core/useModalFocus';
import { SHORTCUT_PREFIX_GO } from '../../constants/shortcuts';
import '../../styles/shortcuts-help.css';

function KeyboardShortcutsHelp({ isOpen, onClose, shortcuts }) {
  const dialogRef = useRef(null);

  useModalFocus({ isOpen, onClose, dialogRef });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop shortcuts-help-backdrop active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-help-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="modal-dialog shortcuts-help-dialog"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <ModalHeader
          title={MESSAGES.KEYBOARD_SHORTCUTS_TITLE}
          titleId="shortcuts-help-title"
          onClose={onClose}
        />
        <div className="modal-body shortcuts-help-body">
          <p className="shortcuts-help-hint">{MESSAGES.KEYBOARD_SHORTCUTS_HINT}</p>
          <div className="shortcuts-help-list" role="list">
            <div className="shortcuts-help-row shortcuts-help-row--header">
              <span className="shortcuts-help-keys">
                <kbd>{SHORTCUT_PREFIX_GO}</kbd> + <kbd>?</kbd>
              </span>
              <span className="shortcuts-help-desc">{MESSAGES.KEYBOARD_SHORTCUTS_GO_LABEL}</span>
            </div>
            {shortcuts.map((s) => (
              <div key={`${s.key}-${s.route}`} className="shortcuts-help-row" role="listitem">
                <span className="shortcuts-help-keys">
                  <kbd>{SHORTCUT_PREFIX_GO}</kbd> + <kbd>{s.key}</kbd>
                </span>
                <span className="shortcuts-help-desc">{MESSAGES[s.labelKey] ?? s.labelKey}</span>
              </div>
            ))}
            <div className="shortcuts-help-row">
              <span className="shortcuts-help-keys">
                <kbd>?</kbd>
              </span>
              <span className="shortcuts-help-desc">{MESSAGES.KEYBOARD_SHORTCUTS_SHOW_HELP}</span>
            </div>
            <div className="shortcuts-help-row">
              <span className="shortcuts-help-keys">
                <kbd>Esc</kbd>
              </span>
              <span className="shortcuts-help-desc">{MESSAGES.KEYBOARD_SHORTCUTS_CLOSE}</span>
            </div>
          </div>
          <p className="shortcuts-help-footer">
            <FiCommand aria-hidden className="shortcuts-help-icon" />
            {MESSAGES.KEYBOARD_SHORTCUTS_FOOTER}
          </p>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsHelp;
