# AI Photo Trip Planner

AI Photo Trip Planner ist ein lokales MVP fuer personalisierte Fototrips.
Die App kombiniert kostenlose OpenStreetMap-Datenquellen mit einem lokalen
LLM ueber Ollama, um aus wenigen Nutzereingaben einen fotografisch sinnvollen
Tagesplan zu erzeugen.

## Dokumentationspflege

Die Dokumentation im Ordner `docs` soll bei projektrelevanten Aenderungen immer
mitgezogen werden.

Pflicht zur Aktualisierung besteht insbesondere bei:

- neuen installierten oder verwendeten Skills
- Architektur-Aenderungen im Frontend oder Backend
- neuen oder ausgetauschten Technologien
- neuen externen APIs, Services oder Laufzeitabhaengigkeiten
- groesseren Aenderungen an Setup, Projektstruktur oder Entwicklungsworkflow

Dabei gilt:

- Skill-bezogene Aenderungen kommen in `docs/skills.md`
- Architektur-, Technologie- und Projektstruktur-Aenderungen kommen in diese Datei

## Projektziel

Ein Nutzer gibt wenige Informationen an:

- Stadt oder Region
- Dauer des Trips
- Fotostile
- Reisestil
- Startzeit
- Verkehrsmittel
- Budget
- bevorzugte Bildstimmung

Die App erstellt daraus:

- 3 bis 5 passende Fotospots
- empfohlene Reihenfolge
- beste Uhrzeit pro Spot
- Begruendung pro Spot
- 1 bis 2 Fotoideen pro Spot
- visuelle Darstellung auf einer Karte

## MVP-Umfang

Der Fokus des MVP liegt auf einem eintagesfaehigen City-Fototrip.

Im MVP enthalten:

- eine einfache React-UI fuer Eingabe und Ausgabe
- lokale Reiseplanung ohne externe Bezahl-APIs
- Kartenansicht mit Spot-Marker und Reihenfolge
- lokale KI-Ausgabe ueber Ollama
- robuster Fallback ohne KI, falls Ollama nicht erreichbar ist

Nicht im ersten MVP:

- Benutzerkonten
- persistente Speicherung
- echte Strassennavigation Turn-by-Turn
- Live-Crowd-Level
- verifizierte Eintrittspreise und Oeffnungszeiten

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
- native `fetch` aus Node 22

### Lokale KI

- Ollama als lokaler LLM-Server
- Standardmodell im Projekt: `llama3.1:8b`

Das Modell ist in der App konfigurierbar. Fuer den ersten Start ist ein
mittelgrosses Modell sinnvoll, das auch auf Consumer-Hardware noch realistisch
laeuft.

## Verwendete kostenlose APIs

### 1. Nominatim

Zweck:

- Geocoding fuer Stadt oder Region

Nutzung im Projekt:

- Umwandlung eines Ortsnamens in Latitude und Longitude
- Ermittlung eines sinnvollen Kartenzentrums

Hinweis:

- oeffentliche Nutzung ist limitiert
- keine aggressive Autocomplete-Nutzung
- fuer Produktionslast spaeter eigener Proxy oder anderer Dienst sinnvoll

### 2. Overpass API

Zweck:

- Suche nach OpenStreetMap-Objekten wie Aussichtspunkten, Cafes, Parks,
  Promenaden, Bruecken, Architekturpunkten und anderen moeglichen Fotospots

Nutzung im Projekt:

- Abruf von Kandidaten-Spots im Umkreis der Zielstadt
- Filterung nach Fotostilen wie Street, Architecture, Nature, Sunset,
  Hidden Gems

### 3. Sunrise-Sunset API

Zweck:

- Ermittlung von Sonnenaufgang und Sonnenuntergang

Nutzung im Projekt:

- Ableitung von `goldener Stunde`, spaeterem Nachmittagslicht oder fruehen
  ruhigen Zeitfenstern

## Warum kein externer kostenpflichtiger AI-Dienst

Das Projekt soll nur kostenlose APIs nutzen.
Deshalb wird kein kostenpflichtiger Cloud-LLM-Dienst wie OpenAI verwendet.
Die Textgenerierung laeuft lokal ueber Ollama.

Vorteile:

- keine API-Kosten
- mehr Kontrolle ueber Daten
- Entwicklung auch ohne Cloudanbieter moeglich

Nachteile:

- lokale Installation notwendig
- Antwortqualitaet haengt vom verwendeten Modell und der Hardware ab

## Architektur

### High-Level-Flow

1. Nutzer fuellt das Formular im Frontend aus.
2. Frontend sendet die Anfrage an das lokale Backend.
3. Backend geocodiert den Ort ueber Nominatim.
4. Backend sammelt Spot-Kandidaten ueber Overpass.
5. Backend bewertet und filtert die Spots anhand der gewaehlten Fotostile.
6. Backend ordnet die Spots mit einer einfachen Distanz-Heuristik.
7. Backend berechnet geeignete Zeitfenster auf Basis von Startzeit, Dauer und
   Sonnenzeiten.
8. Backend gibt Spotdaten an Ollama weiter.
9. Ollama liefert kreative Texte und Shot-Ideen als JSON.
10. Falls Ollama nicht erreichbar ist, erzeugt das Backend einen regelbasierten
    Fallback-Plan.
11. Frontend zeigt Route, Karte und Spot-Karten an.

### Warum eine Distanz-Heuristik statt echter Routing-API

Fuer das MVP wollen wir ohne API-Key und ohne Bezahlmodell auskommen.
Deshalb sortiert das Backend die Spots zunaechst mit einer einfachen
Nearest-Neighbor-Logik.

Das Ergebnis ist fuer einen ersten City-Trip ausreichend:

- sinnvolle Reihenfolge
- kurze Wege zwischen benachbarten Spots
- keine Abhaengigkeit von externer Turn-by-Turn-Navigation

Spaeter kann diese Stelle gegen einen echten kostenlosen oder selbst gehosteten
Routing-Dienst ausgetauscht werden.

## Kernfunktionen

### Eingaben

- Stadt oder Region
- Dauer: halber Tag oder ganzer Tag
- Fotostile:
  - Street
  - Nature
  - Architecture
  - Sunset
  - Hidden Gems
- Reisestil:
  - entspannt
  - ausgewogen
  - viele Spots
- Startzeit
- Verkehrsmittel
- Budget
- Stimmung oder fotografischer Vibe

### Ausgabe

- Plan-Titel
- kurze Gesamtzusammenfassung
- 3 bis 5 empfohlene Spots
- Spot-Beschreibung
- beste Uhrzeit
- Grund, warum der Spot passt
- 1 bis 2 Fotoideen
- empfohlene Reihenfolge
- einfache Kartenvisualisierung

## Datenmodell

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

## Lokale Ollama-Integration

Die App erwartet standardmaessig einen lokalen Ollama-Server unter:

`http://127.0.0.1:11434`

Verwendete API:

- `POST /api/generate`

Erwartung:

- strukturierte JSON-Antwort mit Beschreibungen, Begruendungen und Fotoideen

Empfohlener Start:

1. Ollama installieren
2. Modell laden, zum Beispiel `llama3.1:8b`
3. lokalen Server verfuegbar machen
4. App starten

Beispiel:

```bash
ollama pull llama3.1:8b
ollama serve
```

## Fallback-Strategie

Wenn Ollama nicht laeuft oder fehlerhaft antwortet, bleibt das Produkt nutzbar.

Fallback-Verhalten:

- Spot-Auswahl bleibt aktiv
- Reihenfolge bleibt aktiv
- Zeitfenster bleiben aktiv
- Beschreibung und Fotoideen werden aus Templates erzeugt

So ist die Anwendung auch ohne laufendes LLM testbar.

## Projektstruktur

```text
.
├── README.md
├── docs
│   ├── README.md
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

## Entwicklungsstrategie

### Phase 1

- Projektgeruest
- Formular
- Backend-Endpunkt
- freie Datenquellen anbinden
- fallbackfaehige Planung

### Phase 2

- bessere Ranking-Heuristiken
- bessere Kartenvisualisierung
- echte Routing-Integration
- Zwischenspeicherung von Suchergebnissen

### Phase 3

- Save and share
- mehrere Tagesplaene
- Bild-Upload fuer Referenzstimmung
- Favoriten und Export

## Wichtige Hinweise

- Oeffentliche OSM-Dienste sind fuer moderate Nutzung gedacht, nicht fuer hohe
  Produktionslast.
- Spotdaten aus OpenStreetMap sind community-basiert und koennen unvollstaendig
  sein.
- Lost Places sollten nicht aktiv als illegal zugangliche Orte beworben werden.
- Tageszeiten fuer wenig Menschen sind nur Heuristiken und keine Garantie.

## Lokales Setup

### Voraussetzungen

- Node.js 22+
- npm 10+
- Ollama lokal installiert, wenn KI-Antworten aktiv sein sollen

### Start

```bash
npm install
npm run dev
```

### Environment

Siehe `.env.example`.

## Weiterentwicklung

Sinnvolle naechste Schritte:

- bessere Prompt-Optimierung fuer unterschiedliche Fotostile
- differenziertere Spotkategorien
- Caching fuer Nominatim und Overpass
- Filter fuer kostenlose versus kostenpflichtige Locations
- Wetterintegration fuer noch bessere Licht- und Stimmungsplanung
