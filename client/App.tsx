import { useState } from "react";
import { createTripPlan } from "./api";
import { durationOptions, paceOptions, styleOptions, transportOptions } from "./constants";
import { ResultsPanel } from "./components/ResultsPanel";
import { TripForm } from "./components/TripForm";
import { TripMap } from "./components/TripMap";
import type { TripPlan, TripRequest } from "./types";

const initialRequest: TripRequest = {
  city: "Copenhagen",
  duration: "full-day",
  styles: ["street", "architecture"],
  pace: "relaxed",
  startTime: "09:00",
  transport: "walk",
  budget: null,
  vibe: "moody, quiet streets, no rush"
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
          : "Unknown planning error."
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
  const budgetLabel = formValue.budget ? `${formValue.budget} EUR` : "flexible";

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-header-row">
          <p className="eyebrow">AI Photo Trip Planner</p>
          <p className="hero-kicker">Editorial trip planning for calmer photography days</p>
        </div>

        <div className="hero-grid">
          <div className="hero-copy-block">
            <h1>Plan a photography day that feels composed, not crowded.</h1>
            <p className="hero-copy">
              A few inputs become a clear route with better timing, fitting stops, and practical photo ideas.
            </p>

            <div className="hero-badge-row">
              <span className="hero-badge">Local AI with Ollama</span>
              <span className="hero-badge">OpenStreetMap-based spots</span>
              <span className="hero-badge">Timing and sequence first</span>
            </div>
          </div>

          <aside className="hero-aside">
            <div className="hero-aside-card">
              <p className="eyebrow">Current Trip Profile</p>
              <h2>{formValue.city}</h2>
              <p className="hero-aside-copy">
                {formValue.vibe || "Describe the mood and visual direction for the day."}
              </p>

              <div className="hero-stat-grid">
                <div className="hero-stat">
                  <span className="hero-stat-label">Duration</span>
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
                  <span className="hero-stat-label">Transport</span>
                  <strong>{transportLabel}</strong>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-label">Budget</span>
                  <strong>{budgetLabel}</strong>
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
                  <span className="hero-style-pill">Choose photo styles</span>
                )}
              </div>

              <p className="hero-profile-note">
                The planner combines place, pace, light, and style into one readable shooting day.
              </p>
            </div>
          </aside>
        </div>
      </header>

      <main className="workspace">
        <div className="planner-column">
          <TripForm
            value={formValue}
            isLoading={isLoading}
            onChange={setFormValue}
            onSubmit={handleSubmit}
          />
        </div>
        <div className="output-column">
          <TripMap plan={plan} />
          <ResultsPanel plan={plan} error={error} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}

export default App;
