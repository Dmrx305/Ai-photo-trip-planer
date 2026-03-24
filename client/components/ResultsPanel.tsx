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
        <h2>The plan is coming together</h2>
        <div className="placeholder-stack">
          <p className="muted">
            Spots are being gathered, ordered, and refined with photographic cues.
          </p>
          <div className="placeholder-card" />
          <div className="placeholder-card" />
          <div className="placeholder-card" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel results-panel">
        <p className="eyebrow">Problem</p>
        <h2>The trip could not be created</h2>
        <p className="muted">{error}</p>
        <div className="error-help">
          <strong>Try next:</strong>
          <p>a different city, at least one photo style, and a slightly broader visual mood.</p>
        </div>
      </section>
    );
  }

  if (!plan) {
    return (
      <section className="panel results-panel placeholder-panel">
        <p className="eyebrow">Output</p>
        <h2>Your photo plan will appear here</h2>
        <div className="placeholder-stack">
          <p className="muted">
            You will get a clear route structure with fitting stops, timing windows, and shot ideas.
          </p>
          <div className="preview-list">
            <div className="preview-item">
              <strong>Stop 1</strong>
              <span>quiet opening with strong light and atmosphere</span>
            </div>
            <div className="preview-item">
              <strong>Stop 2</strong>
              <span>urban middle section with motion and detail</span>
            </div>
            <div className="preview-item">
              <strong>Stop 3</strong>
              <span>later light for the final stop or sunset</span>
            </div>
          </div>
        </div>
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
            {plan.generatedWith === "ollama" ? "With Ollama" : "Fallback"}
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
              <div className="spot-heading-block">
                <p className="spot-index">Stop {spot.rank}</p>
                <h3>{spot.name}</h3>
                <p className="spot-meta">
                  Best time: {spot.bestTime} · Type: {spot.type}
                </p>
              </div>
              <div className="time-badge">{spot.timeWindow}</div>
            </div>

            {spot.tags.length > 0 ? (
              <div className="spot-tag-row">
                {spot.tags.slice(0, 4).map((tag) => (
                  <span key={`${spot.id}-${tag}`} className="spot-tag">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="spot-copy-grid">
              <div>
                <p className="spot-description">{spot.description}</p>
                <p className="muted">{spot.reason}</p>
              </div>

              <div className="spot-side-note">
                <span className="spot-side-note-label">Shot cues</span>
                <p>
                  Work here with rhythm, contrast, and observation instead of only chasing postcard shots.
                </p>
              </div>
            </div>

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
