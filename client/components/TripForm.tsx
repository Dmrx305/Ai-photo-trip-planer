import type { ChangeEvent, FormEvent } from "react";
import { durationOptions, paceOptions, styleOptions, transportOptions } from "../constants";
import type { PhotoStyle, TripRequest } from "../types";

type TripFormProps = {
  value: TripRequest;
  isLoading: boolean;
  onChange: (nextValue: TripRequest) => void;
  onSubmit: () => void;
};

function toggleStyle(selected: PhotoStyle[], style: PhotoStyle): PhotoStyle[] {
  return selected.includes(style)
    ? selected.filter((entry) => entry !== style)
    : [...selected, style];
}

export function TripForm({ value, isLoading, onChange, onSubmit }: TripFormProps) {
  const updateField = <K extends keyof TripRequest>(field: K, nextValue: TripRequest[K]) => {
    onChange({
      ...value,
      [field]: nextValue
    });
  };

  const handleBudgetChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value.trim();
    updateField("budget", nextValue ? Number(nextValue) : null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="panel-header">
        <p className="eyebrow">Trip Input</p>
        <h2>Set the basics for the day</h2>
        <p className="muted">Keep it simple: place, pace, style, and mood.</p>
      </div>

      <section className="form-section">
        <div className="section-heading">
          <p className="eyebrow">Trip basics</p>
          <h3>Where and how should the day unfold?</h3>
        </div>

        <label className="field">
          <span>City or region</span>
          <input
            type="text"
            value={value.city}
            onChange={(event) => updateField("city", event.target.value)}
            placeholder="e.g. Copenhagen"
            required
          />
          <small className="field-hint">The search starts from this area.</small>
        </label>

        <div className="field-grid">
          <label className="field">
            <span>Duration</span>
            <select
              value={value.duration}
              onChange={(event) => updateField("duration", event.target.value as TripRequest["duration"])}
            >
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Travel pace</span>
            <select
              value={value.pace}
              onChange={(event) => updateField("pace", event.target.value as TripRequest["pace"])}
            >
              {paceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <p className="eyebrow">Photo direction</p>
          <h3>What should the trip look like?</h3>
        </div>

        <div className="field-grid">
          <label className="field">
            <span>Start time</span>
            <input
              type="time"
              value={value.startTime}
              onChange={(event) => updateField("startTime", event.target.value)}
            />
          </label>

          <label className="field">
            <span>Transport</span>
            <select
              value={value.transport}
              onChange={(event) => updateField("transport", event.target.value as TripRequest["transport"])}
            >
              {transportOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="field">
          <span>Photo styles</span>
          <div className="chip-grid">
            {styleOptions.map((option) => {
              const isActive = value.styles.includes(option.value);
              return (
                <button
                  key={option.value}
                  className={`chip ${isActive ? "chip-active" : ""}`}
                  type="button"
                  onClick={() => updateField("styles", toggleStyle(value.styles, option.value))}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="field">
          <span>Visual mood or vibe</span>
          <textarea
            value={value.vibe}
            onChange={(event) => updateField("vibe", event.target.value)}
            placeholder="moody, quiet, cinematic, urban..."
            rows={3}
          />
          <small className="field-hint">Example: fewer people, clean lines, warm evening light.</small>
        </label>

        <label className="field">
          <span>Budget in EUR</span>
          <input
            type="number"
            min="0"
            step="1"
            value={value.budget ?? ""}
            onChange={handleBudgetChange}
            placeholder="optional"
          />
        </label>
      </section>

      <div className="submit-block">
        <button className="primary-button" type="submit" disabled={isLoading || value.styles.length === 0}>
          {isLoading ? "Building trip..." : "Generate photo trip"}
        </button>
      </div>
    </form>
  );
}
