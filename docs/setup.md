# Setup

## Requirements

- Node.js 22+
- npm 10+
- Ollama installed locally if AI-generated text should be enabled

## Install Dependencies

```bash
npm install
```

## Environment Variables

The project currently uses:

```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.1:8b
SERVER_PORT=8787
SERVER_HOST=127.0.0.1
```

Create your local environment file based on `.env.example` when needed.

## Start Ollama

Example:

```bash
ollama pull llama3.1:8b
ollama serve
```

If Ollama is not running, the app still works in fallback mode.

## Start The App

```bash
npm run dev
```

This starts:

- the Vite frontend
- the local Express backend

## Useful Commands

```bash
npm run typecheck
npm run build
```

## Local URLs

- frontend: `http://127.0.0.1:5173`
- backend: `http://127.0.0.1:8787`

## Common Issues

### Ollama is not installed

Result:

- plan generation still works
- the backend returns a fallback-based plan instead of Ollama-enriched text

### Too few spots found

Try:

- a larger city
- broader photo styles
- a less specific vibe

### Public API instability

The project depends on public free services. Temporary failures from Nominatim or Overpass are possible and should be expected during MVP development.
