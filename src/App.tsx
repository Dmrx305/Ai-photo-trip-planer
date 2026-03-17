import { useState } from "react";
import { createTripPlan } from "./api";
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

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">AI Photo Trip Planner</p>
        <h1>Fototrips mit lokalem Ollama und freien Kartendaten</h1>
        <p className="hero-copy">
          Das MVP kombiniert OpenStreetMap-Daten, einfache Routenlogik und ein
          lokales Sprachmodell, um dir einen fotografisch sinnvollen Tag zu
          skizzieren.
        </p>
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
