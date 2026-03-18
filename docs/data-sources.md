# Data Sources

## Overview

The MVP uses free, public data services wherever possible.
This keeps costs low, but it also means reliability and data completeness are limited.

## Nominatim

Purpose:

- resolve city or region input into coordinates

Used in:

- `server/services/geocoding.ts`

Strengths:

- free and simple geocoding
- strong fit for location-centered MVP input

Limitations:

- limited public usage
- not meant for heavy autocomplete traffic
- should be treated carefully in production

## Overpass API

Purpose:

- fetch OpenStreetMap entities that can become candidate photo spots

Used in:

- `server/services/overpass.ts`

Strengths:

- flexible access to OSM data
- useful for exploring cafes, viewpoints, architecture, parks, and other location types

Limitations:

- query stability can vary
- POI quality depends on local OSM coverage
- results may be noisy, sparse, or unexpectedly generic

Current handling:

- multiple radius attempts for more robust requests
- deduplication of candidate spots
- style-based filter groups

## Sunrise-Sunset API

Purpose:

- fetch sunrise and sunset times for timing suggestions

Used in:

- `server/services/sun.ts`

Strengths:

- simple and lightweight
- enough for a first golden-hour-aware MVP

Limitations:

- only gives basic sun timing, not full weather or cloud conditions

## Ollama

Purpose:

- local LLM enrichment for descriptions, reasons, and photo ideas

Used in:

- `server/services/ollama.ts`

Strengths:

- no paid cloud dependency
- local-first development
- privacy-friendly for experimentation

Limitations:

- requires local installation
- output quality depends on the model and hardware
- may return invalid or incomplete JSON

Current handling:

- fallback mode is built in
- the app remains usable when Ollama is unavailable

## Practical Rule For This Project

The backend should continue to treat all external sources as best-effort:

- place data may be incomplete
- spot relevance is heuristic
- crowd timing is inferred, not measured
- AI output must remain optional
