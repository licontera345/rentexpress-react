import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './core/useAuth';
import { getShortcutsForRole, SHORTCUT_PREFIX_GO } from '../constants/shortcuts';
import { USER_ROLES } from '../constants';

const PREFIX_TIMEOUT_MS = 1500;

function isInputFocused(target) {
  if (!target || !target.closest) return false;
  const tag = target.tagName?.toUpperCase();
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts(options = {}) {
  const { onShowShortcutsHelp } = options;
  const navigate = useNavigate();
  const { role } = useAuth();
  const isEmployee = role === USER_ROLES.EMPLOYEE;
  const shortcuts = getShortcutsForRole(isEmployee);

  const pendingPrefixRef = useRef(false);
  const prefixTimeoutRef = useRef(null);

  const clearPrefixTimeout = useCallback(() => {
    if (prefixTimeoutRef.current) {
      clearTimeout(prefixTimeoutRef.current);
      prefixTimeoutRef.current = null;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (isInputFocused(e.target)) return;

      // ? o Shift+/ → abrir ayuda de atajos (Shift+/ genera key '?' en la mayoría de teclados)
      if (typeof onShowShortcutsHelp === 'function' && (e.key === '?' || (e.shiftKey && e.key === '/'))) {
        e.preventDefault();
        onShowShortcutsHelp();
        return;
      }

      const key = e.key?.toLowerCase();

      // Secuencia "g" + letra
      if (pendingPrefixRef.current) {
        clearPrefixTimeout();
        const shortcut = shortcuts.find((s) => s.key === key);
        if (shortcut) {
          e.preventDefault();
          navigate(shortcut.route);
        }
        pendingPrefixRef.current = false;
        return;
      }

      if (key === SHORTCUT_PREFIX_GO) {
        e.preventDefault();
        pendingPrefixRef.current = true;
        clearPrefixTimeout();
        prefixTimeoutRef.current = setTimeout(() => {
          pendingPrefixRef.current = false;
          prefixTimeoutRef.current = null;
        }, PREFIX_TIMEOUT_MS);
      }
    },
    [navigate, shortcuts, clearPrefixTimeout, onShowShortcutsHelp]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearPrefixTimeout();
    };
  }, [handleKeyDown, clearPrefixTimeout]);
}

export default useKeyboardShortcuts;
