import { useState } from 'react';
import Button from '../../common/actions/Button';
import { BUTTON_SIZES, BUTTON_VARIANTS } from '../../../constants';
import { t } from '../../../i18n';
import '../../../styles/recommendation.css';

const QUESTIONS = [
  {
    name: 'destination',
    labelKey: 'REC_Q1_LABEL',
    options: [
      { value: 'CITY', labelKey: 'REC_Q1_OPT_CITY' },
      { value: 'BEACH', labelKey: 'REC_Q1_OPT_BEACH' },
      { value: 'MOUNTAIN', labelKey: 'REC_Q1_OPT_MOUNTAIN' },
    ],
  },
  {
    name: 'passengers',
    labelKey: 'REC_Q2_LABEL',
    options: [
      { value: 'ONE_TWO', labelKey: 'REC_Q2_OPT_12' },
      { value: 'THREE_FOUR', labelKey: 'REC_Q2_OPT_34' },
      { value: 'FIVE_PLUS', labelKey: 'REC_Q2_OPT_5PLUS' },
    ],
  },
  {
    name: 'tripDuration',
    labelKey: 'REC_Q3_LABEL',
    options: [
      { value: 'SHORT', labelKey: 'REC_Q3_OPT_SHORT' },
      { value: 'MEDIUM', labelKey: 'REC_Q3_OPT_MEDIUM' },
      { value: 'LONG', labelKey: 'REC_Q3_OPT_LONG' },
    ],
  },
  {
    name: 'roadCondition',
    labelKey: 'REC_Q4_LABEL',
    options: [
      { value: 'GOOD', labelKey: 'REC_Q4_OPT_GOOD' },
      { value: 'MIXED', labelKey: 'REC_Q4_OPT_MIXED' },
      { value: 'BAD', labelKey: 'REC_Q4_OPT_BAD' },
    ],
  },
];

function QuestionGroup({ name, labelKey, options, selectedValue, onChange, disabled }) {
  return (
    <fieldset className="rec-question" disabled={disabled}>
      <legend className="rec-question-label">{t(labelKey)}</legend>
      <div className="rec-options">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`rec-option${selectedValue === opt.value ? ' rec-option--selected' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selectedValue === opt.value}
              onChange={() => onChange(name, opt.value)}
              className="rec-option-input"
            />
            <span className="rec-option-text">{t(opt.labelKey)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function VehicleRecommendationPanel({
  preferences,
  setPreference,
  isComplete,
  explanation,
  loading,
  error,
  hasResult,
  onSubmit,
  onReset,
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rec-panel${isOpen ? ' rec-panel--open' : ''}`}>
      <button
        type="button"
        className="rec-panel-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className="rec-panel-toggle-icon">{isOpen ? '▾' : '▸'}</span>
        <span className="rec-panel-toggle-title">{t('REC_TITLE')}</span>
        <span className="rec-panel-toggle-subtitle">{t('REC_SUBTITLE')}</span>
      </button>

      {isOpen && (
        <div className="rec-panel-content">
          <div className="rec-questions">
            {QUESTIONS.map((q) => (
              <QuestionGroup
                key={q.name}
                {...q}
                selectedValue={preferences[q.name]}
                onChange={setPreference}
                disabled={loading || disabled}
              />
            ))}
          </div>

          {error && (
            <p className="rec-error" role="alert">{error}</p>
          )}

          {hasResult && explanation && (
            <div className="rec-result">
              <h4 className="rec-result-title">{t('REC_RESULT_TITLE')}</h4>
              <p className="rec-result-explanation">{explanation}</p>
            </div>
          )}

          <div className="rec-actions">
            <Button
              type="button"
              variant={BUTTON_VARIANTS.PRIMARY}
              size={BUTTON_SIZES.MEDIUM}
              onClick={onSubmit}
              disabled={!isComplete || loading || disabled}
            >
              {loading ? t('REC_LOADING') : t('REC_SUBMIT')}
            </Button>
            {hasResult && (
              <Button
                type="button"
                variant={BUTTON_VARIANTS.OUTLINED}
                size={BUTTON_SIZES.MEDIUM}
                onClick={onReset}
                disabled={loading}
              >
                {t('REC_RESET')}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleRecommendationPanel;
