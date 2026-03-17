import type { TripPlan } from "../types";

type ResultsPanelProps = {
  plan: TripPlan | null;
  error: string | null;
  isLoading: boolean;
};

export function ResultsPanel({ plan, error, isLoading }: ResultsPanelProps) {
  if (isLoading) {
    return (
      <section className="panel results-panel placeholder-panel">
        <p className="eyebrow">Planning</p>
        <h2>Der Plan wird zusammengesetzt</h2>
        <p className="muted">
          Es werden Orte gesucht, geordnet und mit Fotoideen angereichert.
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel results-panel">
        <p className="eyebrow">Problem</p>
        <h2>Der Trip konnte nicht erstellt werden</h2>
        <p className="muted">{error}</p>
      </section>
    );
  }

  if (!plan) {
    return (
      <section className="panel results-panel placeholder-panel">
        <p className="eyebrow">Output</p>
        <h2>Hier erscheint dein Fotoplan</h2>
        <p className="muted">
          Du bekommst eine kurze Tagesstruktur, passende Spots und Shot-Ideen.
        </p>
      </section>
    );
  }

  return (
    <section className="panel results-panel">
      <div className="panel-header">
        <p className="eyebrow">Trip Output</p>
        <div className="results-headline">
          <h2>{plan.title}</h2>
          <span className={`status-pill ${plan.generatedWith}`}>
            {plan.generatedWith === "ollama" ? "Mit Ollama" : "Fallback"}
          </span>
        </div>
        <p className="muted">{plan.summary}</p>
      </div>

      {plan.notes.length > 0 ? (
        <div className="note-list">
          {plan.notes.map((note) => (
            <p key={note} className="note-item">
              {note}
            </p>
          ))}
        </div>
      ) : null}

      <div className="spot-list">
        {plan.spots.map((spot) => (
          <article key={spot.id} className="spot-card">
            <div className="spot-card-top">
              <div>
                <p className="spot-index">Stop {spot.rank}</p>
                <h3>{spot.name}</h3>
              </div>
              <div className="time-badge">{spot.timeWindow}</div>
            </div>

            <p className="spot-meta">
              Beste Zeit: {spot.bestTime} · Typ: {spot.type}
            </p>
            <p>{spot.description}</p>
            <p className="muted">{spot.reason}</p>

            <div className="idea-block">
              {spot.photoIdeas.map((idea) => (
                <p key={idea} className="idea-pill">
                  {idea}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
