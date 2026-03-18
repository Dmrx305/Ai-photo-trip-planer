# AI Photo Trip Planner

AI Photo Trip Planner is a local MVP for personalized photography day trips.
It combines free OpenStreetMap-based data sources with a local LLM via Ollama
to turn a few user inputs into a practical, photography-focused itinerary.

## Documentation Index

- `docs/README.md` -> project overview, scope, stack, and documentation rules
- `docs/architecture.md` -> system structure and request flow
- `docs/api.md` -> backend endpoints and request/response contracts
- `docs/setup.md` -> local development setup and environment
- `docs/data-sources.md` -> external APIs, limits, and fallback assumptions
- `docs/roadmap.md` -> MVP and planned next phases
- `docs/skills.md` -> skill index used in this project
- `docs/skills/frontend-design.md` -> dedicated notes for the frontend-design skill
- `CHANGELOG.md` -> notable project changes and releases

## Documentation Maintenance

Documentation inside `docs` should be updated whenever project-relevant changes
are introduced.

Updates are required especially for:

- newly installed or newly used skills
- frontend or backend architecture changes
- new or replaced technologies
- new external APIs, services, or runtime dependencies
- significant setup, project-structure, or workflow changes

Rules:

- skill-related updates go into `docs/skills.md` and detailed skill pages under
  `docs/skills/`
- architecture, technology, and project-structure changes go into this file

## Project Goal

The user provides a small set of inputs:

- city or region
- trip duration
- photography styles
- travel pace
- start time
- transport mode
- budget
- preferred visual mood

The app generates:

- 3 to 5 relevant photo spots
- recommended order
- best time per spot
- a short reason for each stop
- 1 to 2 photo ideas per stop
- a simple map-based route view

## MVP Scope

The current MVP focuses on a one-day city photo trip.

Included:

- a lightweight React UI for input and output
- local planning without paid APIs
- map view with markers and route order
- local AI output via Ollama
- a robust fallback when Ollama is unavailable

Not included yet:

- user accounts
- persistent storage
- full turn-by-turn road navigation
- live crowd-level data
- verified entry fees and opening hours

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Leaflet
- plain CSS

### Backend

- Node.js
- Express
- TypeScript
- native `fetch` from Node 22

### Local AI

- Ollama as the local LLM server
- default model: `llama3.1:8b`

The model is configurable. For the current MVP, a mid-sized model is a good
starting point for consumer hardware.

## Free APIs Used

### 1. Nominatim

Purpose:

- geocoding for city or region lookup

Used for:

- turning a location name into latitude and longitude
- deriving a useful map center for planning

Notes:

- public usage is limited
- not intended for aggressive autocomplete traffic
- for larger production traffic, a proxy or alternative service would be needed

### 2. Overpass API

Purpose:

- querying OpenStreetMap objects such as viewpoints, cafes, parks, promenades,
  bridges, architecture points, and other possible photo spots

Used for:

- retrieving spot candidates around the requested city
- filtering by photo styles such as Street, Architecture, Nature, Sunset, and
  Hidden Gems

### 3. Sunrise-Sunset API

Purpose:

- retrieving sunrise and sunset times

Used for:

- deriving golden-hour timing, softer afternoon light, and quieter early-day
  windows

## Why There Is No Paid Cloud AI Service

This project is intentionally designed around free APIs.
Because of that, it does not use a paid cloud LLM provider such as OpenAI.
Text generation runs locally through Ollama.

Advantages:

- no API usage costs
- more control over user data
- local development without a cloud dependency

Tradeoffs:

- local installation is required
- output quality depends on the selected model and hardware

## Architecture

### High-Level Flow

1. The user submits the form in the frontend.
2. The frontend sends the request to the local backend.
3. The backend geocodes the place via Nominatim.
4. The backend collects spot candidates via Overpass.
5. The backend filters and scores spots based on the selected photography styles.
6. The backend orders the spots with a simple distance heuristic.
7. The backend assigns time windows based on start time, duration, and sun times.
8. The backend sends structured spot context to Ollama.
9. Ollama returns concise descriptions and shot ideas as JSON.
10. If Ollama fails or is unavailable, the backend generates a rule-based fallback plan.
11. The frontend renders the route, map, and spot cards.

### Why the MVP Uses a Distance Heuristic Instead of Full Routing

The current MVP avoids API keys and paid routing services.
Because of that, the backend uses a nearest-neighbor style ordering heuristic.

For an early city-trip MVP, this is good enough to provide:

- a sensible route order
- shorter jumps between neighboring spots
- no dependency on a full road-routing provider

Later, this can be replaced with a free or self-hosted routing layer if needed.

## Core Features

### Inputs

- city or region
- duration: half day or full day
- photography styles:
  - Street
  - Nature
  - Architecture
  - Sunset
  - Hidden Gems
- travel pace:
  - relaxed
  - balanced
  - packed
- start time
- transport mode
- budget
- visual mood or vibe

### Output

- plan title
- short overall summary
- 3 to 5 recommended spots
- spot description
- best time
- reason the spot fits
- 1 to 2 photo ideas
- recommended order
- simple route visualization

## Data Model

### Input

```ts
type TripRequest = {
  city: string;
  duration: "half-day" | "full-day";
  styles: PhotoStyle[];
  pace: "relaxed" | "balanced" | "packed";
  startTime: string;
  transport: "walk" | "bike" | "car" | "public-transport";
  budget?: number;
  vibe?: string;
};
```

### Output

```ts
type TripPlan = {
  title: string;
  summary: string;
  routePolyline: Coordinate[];
  notes: string[];
  generatedWith: "ollama" | "fallback";
  spots: PlannedSpot[];
};
```

## Local Ollama Integration

The app expects a local Ollama server at:

`http://127.0.0.1:11434`

API used:

- `POST /api/generate`

Expected behavior:

- structured JSON with descriptions, reasons, and photo ideas

Recommended setup:

1. install Ollama
2. pull a model such as `llama3.1:8b`
3. start the local Ollama server
4. run the app

Example:

```bash
ollama pull llama3.1:8b
ollama serve
```

## Fallback Strategy

If Ollama is unavailable or returns invalid output, the app remains usable.

Fallback behavior:

- spot selection still runs
- ordering still runs
- time windows still run
- descriptions and photo ideas are generated from templates

This makes the MVP testable even without a running local LLM.

## Project Structure

```text
.
├── README.md
├── docs
│   ├── README.md
│   ├── skills
│   │   └── frontend-design.md
│   └── skills.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── server
│   ├── index.ts
│   ├── planner.ts
│   ├── prompts.ts
│   ├── fallback.ts
│   ├── scoring.ts
│   ├── time.ts
│   └── services
│       ├── geocoding.ts
│       ├── overpass.ts
│       ├── ollama.ts
│       └── sun.ts
└── src
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── api.ts
    ├── constants.ts
    ├── types.ts
    └── components
        ├── TripForm.tsx
        ├── ResultsPanel.tsx
        └── TripMap.tsx
```

## Development Roadmap

### Phase 1

- project scaffold
- input form
- backend planning endpoint
- connect free external data sources
- fallback-capable planning

### Phase 2

- better ranking heuristics
- stronger map presentation
- real routing integration
- caching for search results

### Phase 3

- save and share flows
- multi-day plans
- image-based mood input
- favorites and export

## Important Notes

- Public OSM services are meant for moderate use, not high production traffic.
- OpenStreetMap spot data is community-maintained and may be incomplete.
- Lost places should not be promoted as illegal-access destinations.
- Low-crowd timing is always heuristic, not guaranteed.

## Local Setup

### Requirements

- Node.js 22+
- npm 10+
- Ollama installed locally if AI responses should be enabled

### Start

```bash
npm install
npm run dev
```

### Environment

See `.env.example`.

## Next Steps

Likely next improvements:

- better prompt tuning for different photography styles
- more nuanced spot categories
- caching for Nominatim and Overpass
- filtering for free versus paid locations
- weather-aware planning for stronger light and atmosphere suggestions
