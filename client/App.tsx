import { useState } from "react";
import { createTripPlan } from "./api";
import { durationOptions, paceOptions, styleOptions, transportOptions } from "./constants";
import { ResultsPanel } from "./components/ResultsPanel";
import { TripForm } from "./components/TripForm";
import { TripMap } from "./components/TripMap";
import type { TripPlan, TripRequest } from "./types";

const initialRequest: TripRequest = {
  city: "Kopenhagen",
  duration: "full-day",
  styles: ["street", "architecture"],
  pace: "relaxed",
  startTime: "09:00",
  transport: "walk",
  budget: null,
  vibe: "moody, ruhige Gassen, wenig Stress"
};

function labelFromValue<T extends string>(
  options: Array<{ value: T; label: string }>,
  value: T
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function App() {
  const [formValue, setFormValue] = useState<TripRequest>(initialRequest);
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextPlan = await createTripPlan(formValue);
      setPlan(nextPlan);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unbekannter Fehler bei der Planung."
      );
      setPlan(null);
    } finally {
      setIsLoading(false);
    }
  };

  const durationLabel = labelFromValue(durationOptions, formValue.duration);
  const paceLabel = labelFromValue(paceOptions, formValue.pace);
  const transportLabel = labelFromValue(transportOptions, formValue.transport);
  const selectedStyleLabels = formValue.styles.map((style) =>
    labelFromValue(styleOptions, style)
  );

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-grid">
          <div className="hero-copy-block">
            <p className="eyebrow">AI Photo Trip Planner</p>
            <h1>Finde Fotospots, die sich wie ein echter Shooting-Tag anfuehlen.</h1>
            <p className="hero-copy">
              Plane aus wenigen Angaben einen fotografisch sinnvollen Tagestrip mit
              Lichtstimmung, Reihenfolge, Kartenansicht und kreativen Shot-Ideen.
            </p>

            <div className="hero-badge-row">
              <span className="hero-badge">Lokal mit Ollama</span>
              <span className="hero-badge">Kostenlose Kartendaten</span>
              <span className="hero-badge">MVP fuer Foto-Workflows</span>
            </div>
          </div>

          <aside className="hero-aside">
            <div className="hero-aside-card">
              <p className="eyebrow">Live Input Preview</p>
              <h2>{formValue.city}</h2>
              <p className="hero-aside-copy">
                {formValue.vibe || "Beschreibe hier die gewuenschte Bildstimmung."}
              </p>

              <div className="hero-stat-grid">
                <div className="hero-stat">
                  <span className="hero-stat-label">Dauer</span>
                  <strong>{durationLabel}</strong>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-label">Pace</span>
                  <strong>{paceLabel}</strong>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-label">Start</span>
                  <strong>{formValue.startTime}</strong>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-label">Mobilitaet</span>
                  <strong>{transportLabel}</strong>
                </div>
              </div>

              <div className="hero-style-list">
                {selectedStyleLabels.length > 0 ? (
                  selectedStyleLabels.map((label) => (
                    <span key={label} className="hero-style-pill">
                      {label}
                    </span>
                  ))
                ) : (
                  <span className="hero-style-pill">Waehle Fotostile</span>
                )}
              </div>
            </div>
          </aside>
        </div>
      </header>

      <main className="layout">
        <div className="left-column">
          <TripForm
            value={formValue}
            isLoading={isLoading}
            onChange={setFormValue}
            onSubmit={handleSubmit}
          />
          <TripMap plan={plan} />
        </div>
        <ResultsPanel plan={plan} error={error} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
