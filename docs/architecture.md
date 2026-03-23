# Architecture

## Overview

AI Photo Trip Planner is split into a lightweight frontend and a local backend.
The frontend collects user intent and renders the route. The backend owns the
planning pipeline, including geocoding, spot discovery, ordering, time-slot
assignment, and optional enrichment through Ollama.

## Main Building Blocks

### Frontend

Location:

- `client/`

Responsibilities:

- collect trip input from the user
- call the local backend
- display the generated plan
- visualize the ordered route on a map

Main files:

- `client/App.tsx`
- `client/components/TripForm.tsx`
- `client/components/ResultsPanel.tsx`
- `client/components/TripMap.tsx`

## Diagrams

The project uses Excalidraw files as the single diagram format for the current MVP:

- `docs/diagrams/architecture.excalidraw`
- `docs/diagrams/planner-flow.excalidraw`

### Backend

Location:

- `server/`

Responsibilities:

- validate request payloads
- geocode city/region input
- fetch candidate spots from Overpass
- fetch sun times
- score and order selected spots
- build time windows
- call Ollama when available
- return a fallback plan when Ollama fails

Main files:

- `server/index.ts`
- `server/planner.ts`
- `server/scoring.ts`
- `server/time.ts`
- `server/fallback.ts`

### Service Layer

Location:

- `server/services/`

Responsibilities:

- `geocoding.ts` -> Nominatim lookup
- `overpass.ts` -> OSM spot discovery
- `sun.ts` -> sunrise/sunset lookup
- `ollama.ts` -> local LLM integration

## Request Flow

1. The user submits the form in the frontend.
2. The frontend sends a `POST /api/plan-trip` request.
3. The backend validates the request with `zod`.
4. Nominatim resolves the requested place into coordinates.
5. Overpass returns candidate POIs and spot-like locations.
6. Sunrise-Sunset returns sunrise and sunset times.
7. The backend scores and filters spots for the selected photo styles.
8. The backend orders spots using a distance-based heuristic.
9. Time windows are assigned based on trip duration and start time.
10. Ollama optionally enriches the result with better text and photo ideas.
11. If Ollama is unavailable, the fallback generator returns a usable plan.
12. The frontend renders the spot list and map view.

For the current local setup, the Ollama path has been verified end-to-end with
the installed `llama3.1:8b` model. Fallback mode remains the backup path, not
the default path, as long as the local Ollama service is running.

## Why The Current Architecture Fits The MVP

This architecture keeps the MVP practical and inexpensive:

- no paid API dependency
- no user accounts or persistent data layer
- no dedicated database
- no routing provider key required
- local AI remains optional because fallback mode still works

## Known Architectural Constraints

- spot quality depends heavily on OSM coverage
- route order is heuristic, not full road routing
- crowdedness is not based on live data
- opening hours and entry fees are not guaranteed
- Ollama quality depends on the model installed locally

## Planned Evolution

Likely next architectural expansions:

- optional caching layer for geocoding and Overpass requests
- stronger routing integration
- cleaner separation between domain logic and service integrations
- saved plans or export features
- richer AI prompting and validation
