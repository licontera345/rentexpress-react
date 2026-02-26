import { useRef, useState, useEffect, useCallback } from 'react';

const KEY = {
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
  Home: 'Home',
  End: 'End',
};

function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder,
  name,
  id,
  disabled = false,
  className = '',
  variant = 'form',
  'aria-label': ariaLabel,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
  required = false,
  submitOnEnterWhenClosed = false,
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : placeholder ?? '';

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const selectValue = useCallback(
    (val) => {
      onChange?.({ target: { name, value: val } });
      close();
    },
    [name, onChange, close]
  );

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, close]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (!open || highlightedIndex < 0 || !listRef.current) return;
    const el = listRef.current.children[highlightedIndex];
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [open, highlightedIndex]);

  const handleKeyDown = (e) => {
    if (disabled) return;
    switch (e.key) {
      case KEY.Enter:
      case KEY.Space:
        if (!open && submitOnEnterWhenClosed && e.key === KEY.Enter) {
          // Dejar que Enter propague para enviar el formulario (ej. filtros).
          return;
        }
        e.preventDefault();
        if (open) {
          if (highlightedIndex >= 0 && options[highlightedIndex]) {
            selectValue(options[highlightedIndex].value);
          }
        } else {
          setOpen(true);
          const idx = options.findIndex((o) => String(o.value) === String(value));
          setHighlightedIndex(idx >= 0 ? idx : 0);
        }
        break;
      case KEY.Escape:
        e.preventDefault();
        close();
        break;
      case KEY.ArrowDown:
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex((i) => (i < options.length - 1 ? i + 1 : i));
        }
        break;
      case KEY.ArrowUp:
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setHighlightedIndex(options.length - 1);
        } else {
          setHighlightedIndex((i) => (i > 0 ? i - 1 : 0));
        }
        break;
      case KEY.Home:
        e.preventDefault();
        if (open) setHighlightedIndex(0);
        break;
      case KEY.End:
        e.preventDefault();
        if (open) setHighlightedIndex(options.length - 1);
        break;
      default:
        break;
    }
  };

  const triggerClasses = [
    'custom-select-trigger',
    `custom-select-trigger--${variant}`,
    open && 'custom-select-trigger--open',
    disabled && 'custom-select-trigger--disabled',
  ]
    .filter(Boolean)
    .join(' ');

  const wrapperClasses = [
    'custom-select',
    `custom-select--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={wrapperClasses}
      data-state={open ? 'open' : 'closed'}
    >
      <button
        type="button"
        id={id}
        className={triggerClasses}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel ?? undefined}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        aria-required={required || undefined}
      >
        <span className={`custom-select-trigger-label ${!selectedOption && placeholder ? 'custom-select-placeholder' : ''}`}>
          {displayLabel}
        </span>
        <span className="custom-select-chevron" aria-hidden="true">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.4 0.5 6 5.1 10.6 0.5 12 1.9 6 7.9 0 1.9z" fill="currentColor" />
          </svg>
        </span>
      </button>

      {/* Input oculto para formularios (name/value) */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value ?? ''}
          readOnly
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      {open && (
        <div
          ref={listRef}
          role="listbox"
          className="custom-select-dropdown"
          aria-activedescendant={highlightedIndex >= 0 && options[highlightedIndex] ? `${id}-option-${options[highlightedIndex].value}` : undefined}
          onMouseLeave={() => setHighlightedIndex(-1)}
        >
          {options.map((opt, index) => {
            const isSelected = String(opt.value) === String(value);
            const isHighlighted = index === highlightedIndex;
            return (
              <div
                key={opt.value}
                id={`${id}-option-${opt.value}`}
                role="option"
                aria-selected={isSelected}
                className={[
                  'custom-select-option',
                  isSelected && 'custom-select-option--selected',
                  isHighlighted && 'custom-select-option--highlighted',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectValue(opt.value)}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
