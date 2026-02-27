import { useCallback, useEffect, useState } from 'react';

/**
 * Dual range slider sin dependencias: un carril con dos thumbs (inputs type="range")
 * y dos inputs numéricos sincronizados. Diseño compacto, una fila por categoría.
 */
function DualRangeSlider({
  minName,
  maxName,
  minVal,
  maxVal,
  min,
  max,
  step,
  label,
  onChange,
  formatValue = (v) => String(v),
  parseInput = (v) => Number(v) || min,
  disabled = false,
  minInputLabel,
  maxInputLabel,
  'aria-label': ariaLabel,
}) {
  const rangeMin = Number(min);
  const rangeMax = Number(max);
  const rangeStep = Number(step) || 1;

  const clamp = useCallback(
    (v) => Math.min(rangeMax, Math.max(rangeMin, Number(v))),
    [rangeMin, rangeMax]
  );

  const safeMin = clamp(minVal ?? rangeMin);
  const safeMax = clamp(maxVal ?? rangeMax);
  const [low, setLow] = useState(safeMin);
  const [high, setHigh] = useState(safeMax);

  useEffect(() => {
    setLow(clamp(minVal ?? rangeMin));
    setHigh(clamp(maxVal ?? rangeMax));
  }, [minVal, maxVal, rangeMin, rangeMax, clamp]);

  const triggerChange = useCallback(
    (lowValue, highValue) => {
      const l = clamp(lowValue);
      const h = clamp(highValue);
      const finalLow = Math.min(l, h);
      const finalHigh = Math.max(l, h);
      setLow(finalLow);
      setHigh(finalHigh);
      onChange({ target: { name: minName, value: String(finalLow) } });
      onChange({ target: { name: maxName, value: String(finalHigh) } });
    },
    [minName, maxName, onChange, clamp]
  );

  const handleMinSliderChange = (e) => {
    const v = Number(e.target.value);
    triggerChange(v, high);
  };

  const handleMaxSliderChange = (e) => {
    const v = Number(e.target.value);
    triggerChange(low, v);
  };

  const percent = (val) => ((Number(val) - rangeMin) / (rangeMax - rangeMin)) * 100;
  const leftPercent = percent(low);
  const widthPercent = percent(high) - leftPercent;

  return (
    <div className="catalog-dual-range" role="group" aria-label={ariaLabel || label || 'Rango'}>
      {label && (
        <label className="catalog-dual-range-label" id={`${minName}-${maxName}-label`}>
          {label}
        </label>
      )}
      <div className="catalog-dual-range-row">
        <div className="catalog-dual-range-slider">
          <div className="catalog-dual-range-track">
            <div
              className="catalog-dual-range-range"
              style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
            />
          </div>
          <input
            type="range"
            name={minName}
            min={rangeMin}
            max={rangeMax}
            step={rangeStep}
            value={low}
            onChange={handleMinSliderChange}
            disabled={disabled}
            className="catalog-dual-range-input-range catalog-dual-range-input-range--low"
            aria-label={minInputLabel || 'Mínimo'}
            aria-valuemin={rangeMin}
            aria-valuemax={rangeMax}
            aria-valuenow={low}
          />
          <input
            type="range"
            name={maxName}
            min={rangeMin}
            max={rangeMax}
            step={rangeStep}
            value={high}
            onChange={handleMaxSliderChange}
            disabled={disabled}
            className="catalog-dual-range-input-range catalog-dual-range-input-range--high"
            aria-label={maxInputLabel || 'Máximo'}
            aria-valuemin={rangeMin}
            aria-valuemax={rangeMax}
            aria-valuenow={high}
          />
        </div>
        <div className="catalog-dual-range-inputs">
          <input
            type="number"
            name={minName}
            value={low}
            onChange={(e) => {
              const v = parseInput(e.target.value);
              triggerChange(v, high);
            }}
            onBlur={(e) => triggerChange(parseInput(e.target.value), high)}
            min={rangeMin}
            max={rangeMax}
            step={rangeStep}
            disabled={disabled}
            className="catalog-dual-range-input"
            aria-label={minInputLabel || 'Mínimo'}
          />
          <span className="catalog-dual-range-sep" aria-hidden>–</span>
          <input
            type="number"
            name={maxName}
            value={high}
            onChange={(e) => {
              const v = parseInput(e.target.value);
              triggerChange(low, v);
            }}
            onBlur={(e) => triggerChange(low, parseInput(e.target.value))}
            min={rangeMin}
            max={rangeMax}
            step={rangeStep}
            disabled={disabled}
            className="catalog-dual-range-input"
            aria-label={maxInputLabel || 'Máximo'}
          />
        </div>
      </div>
    </div>
  );
}

export default DualRangeSlider;
