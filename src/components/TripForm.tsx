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
        <h2>Plane einen fotografischen Tagestrip</h2>
        <p className="muted">
          Wenige Angaben reichen. Die App kombiniert freie Kartendaten mit einem
          lokalen Ollama-Modell.
        </p>
      </div>

      <label className="field">
        <span>Stadt oder Region</span>
        <input
          type="text"
          value={value.city}
          onChange={(event) => updateField("city", event.target.value)}
          placeholder="z. B. Kopenhagen"
          required
        />
      </label>

      <div className="field-grid">
        <label className="field">
          <span>Dauer</span>
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
          <span>Reisestil</span>
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
          <span>Startzeit</span>
          <input
            type="time"
            value={value.startTime}
            onChange={(event) => updateField("startTime", event.target.value)}
          />
        </label>

        <label className="field">
          <span>Verkehrsmittel</span>
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

      <label className="field">
        <span>Bildstimmung oder Vibe</span>
        <input
          type="text"
          value={value.vibe}
          onChange={(event) => updateField("vibe", event.target.value)}
          placeholder="moody, ruhig, cineastisch, urban..."
        />
      </label>

      <div className="field">
        <span>Fotostile</span>
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

      <button className="primary-button" type="submit" disabled={isLoading || value.styles.length === 0}>
        {isLoading ? "Trip wird erstellt..." : "Fototrip generieren"}
      </button>
    </form>
  );
}
