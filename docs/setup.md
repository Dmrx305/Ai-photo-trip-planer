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

The current local setup was verified with:

- `Ollama.app` on macOS
- model: `llama3.1:8b`

Recommended first-time setup:

```bash
open -a /Applications/Ollama.app
'/Applications/Ollama.app/Contents/Resources/ollama' pull llama3.1:8b
```

If `ollama` is available in your `PATH`, the equivalent CLI flow is:

```bash
ollama pull llama3.1:8b
ollama serve
```

Notes:

- the project defaults to `llama3.1:8b`
- on macOS, starting `Ollama.app` is usually enough to make the local service available
- the first larger generation can take noticeably longer while the model is loading and warming up
- if Ollama is not running, the app still works in fallback mode

## Verify Ollama

Quick checks:

```bash
curl http://127.0.0.1:11434/api/tags
curl http://127.0.0.1:11434/api/generate \
  -H 'Content-Type: application/json' \
  -d '{"model":"llama3.1:8b","prompt":"Return only this exact JSON: {\"ok\":true}","stream":false,"format":"json"}'
```

Expected result:

- `/api/tags` lists `llama3.1:8b`
- `/api/generate` returns a valid JSON string in the `response` field

The current project setup has already been verified against the real planner flow:

- Ollama service reachable on `127.0.0.1:11434`
- model `llama3.1:8b` installed locally
- planner output confirmed with `generatedWith: "ollama"`

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

### Ollama is installed but responses are slow

Possible reasons:

- first model load after startup
- larger planner prompts with multiple spots
- limited local hardware resources

What to expect:

- the first AI-enriched trip can take significantly longer than later requests
- the fallback is only used if Ollama is unreachable or returns invalid JSON

### Too few spots found

Try:

- a larger city
- broader photo styles
- a less specific vibe

### Public API instability

The project depends on public free services. Temporary failures from Nominatim or Overpass are possible and should be expected during MVP development.
