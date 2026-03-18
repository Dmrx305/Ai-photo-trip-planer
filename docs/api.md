# API

## Overview

The current backend exposes a minimal local API for health checks and trip generation.

Base URL during local development:

- `http://127.0.0.1:8787`

## Endpoints

### `GET /api/health`

Purpose:

- simple health check for the local backend

Response:

```json
{
  "ok": true
}
```

### `POST /api/plan-trip`

Purpose:

- generate a photography-oriented trip plan from user input

## Request Body

```json
{
  "city": "Aarhus",
  "duration": "full-day",
  "styles": ["street", "architecture"],
  "pace": "relaxed",
  "startTime": "09:00",
  "transport": "walk",
  "budget": null,
  "vibe": "moody, calm, low stress"
}
```

## Request Rules

- `city` must be a non-empty string with at least 2 characters
- `duration` must be `half-day` or `full-day`
- `styles` must contain at least one supported style
- `pace` must be `relaxed`, `balanced`, or `packed`
- `startTime` must match `HH:MM`
- `transport` must be one of the supported transport modes
- `budget` can be a number or `null`
- `vibe` is a string and may be empty

## Successful Response Shape

```json
{
  "title": "Aarhus: photographic day plan",
  "summary": "A compact route with 3 spots tailored to street and architecture.",
  "routePolyline": [
    { "lat": 56.15, "lon": 10.21 }
  ],
  "notes": [
    "Sunrise: 06:32",
    "Sunset: 18:23"
  ],
  "generatedWith": "fallback",
  "spots": [
    {
      "id": "123",
      "name": "Example Spot",
      "type": "cafe",
      "lat": 56.15,
      "lon": 10.21,
      "tags": ["cafe"],
      "score": 10.5,
      "rank": 1,
      "bestTime": "09:00-11:30",
      "timeWindow": "09:00-11:30",
      "reason": "Why this spot fits",
      "description": "Short spot description",
      "photoIdeas": [
        "Use reflections in windows",
        "Wait for a single figure to enter the frame"
      ]
    }
  ]
}
```

## Error Responses

### `400 Bad Request`

Returned when the request does not match the expected schema.

Current response body:

```text
Ungueltige Eingabedaten.
```

### `500 Internal Server Error`

Returned when planning fails, for example:

- place lookup failed
- too few suitable spots were found
- external source requests failed

The current implementation may return a plain-text error message.

## Notes

- The planner tries Ollama first and falls back when needed.
- The frontend should treat `generatedWith` as the source-of-truth for whether AI enrichment was used.
- The current API is local-first and not yet versioned.
