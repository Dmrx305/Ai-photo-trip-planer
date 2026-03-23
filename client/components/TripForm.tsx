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
        <h2>Shape the day before the route is built</h2>
        <p className="muted">
          A few inputs are enough. Place, light, pace, and image style become a cleaner daily route.
        </p>
      </div>

      <div className="form-callout">
        <strong>MVP focus:</strong> a composed day with 3 to 5 strong stops instead of an overloaded checklist.
      </div>

      <section className="form-section">
        <div className="section-heading">
          <p className="eyebrow">Location</p>
          <h3>Where should the trip happen?</h3>
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
          <small className="field-hint">
            Search starts from OpenStreetMap data for this area.
          </small>
        </label>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <p className="eyebrow">Pacing</p>
          <h3>How should the day feel?</h3>
        </div>

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
      </section>

      <section className="form-section">
        <div className="section-heading">
          <p className="eyebrow">Visual direction</p>
          <h3>What kinds of images should lead the day?</h3>
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
          <small className="field-hint">
            Combining styles helps the planner build better spot variety and pacing.
          </small>
        </div>

        <label className="field">
          <span>Visual mood or vibe</span>
          <textarea
            value={value.vibe}
            onChange={(event) => updateField("vibe", event.target.value)}
            placeholder="moody, quiet, cinematic, urban..."
            rows={3}
          />
          <small className="field-hint">
            For example: fewer people, clean lines, warm evening light, or moody street scenes.
          </small>
        </label>
      </section>

      <section className="form-section">
        <div className="section-heading">
          <p className="eyebrow">Optional</p>
          <h3>Constraints and extras</h3>
        </div>

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
        <p className="submit-note">
          The plan combines real spots, route order, light timing, and shot ideas.
        </p>
      </div>
    </form>
  );
}
