# Verwendete Skills

Dieses Dokument sammelt die Skills, die fuer dieses Projekt bereits verwendet
oder projektbezogen installiert wurden.

## Pflegehinweis

Dieses Dokument soll bei jeder neuen Skill-Installation oder Skill-Nutzung fuer
das Projekt aktualisiert werden.

Zu dokumentieren sind mindestens:

- Skill-Name
- Installations- oder Nutzungsstatus
- Zweck im Projekt
- betroffene Dateien oder Projektbereiche
- sichtbares Ergebnis oder Einfluss auf den Projektstand

## Aktuell relevante Skills

### `frontend-design`

Status:

- installiert
- fuer dieses Projekt verwendet

Zweck:

- visuelles Redesign des Frontends
- staerkere UI-Hierarchie fuer Hero, Formular, Kartenbereich und Ergebnisansicht
- atmosphaerischerer Look passend zu Fotografie, Reiseplanung und kreativem Tooling

Bisher im Projekt angewendet auf:

- `src/App.tsx`
- `src/components/TripForm.tsx`
- `src/components/ResultsPanel.tsx`
- `src/components/TripMap.tsx`
- `src/index.css`

Ergebnis:

- neuer Hero-Bereich mit Input-Preview
- klarere Formularsektionen
- staerkere visuelle Struktur fuer die Trip-Ausgabe
- aufgewertete Kartenpraesentation
- konsistenteres Farb- und Typografie-System

### `skill-installer`

Status:

- verwendet

Zweck:

- Installation externer Skills in die lokale Codex-Skill-Umgebung

Bisher im Projekt genutzt fuer:

- Installation von `frontend-design` aus `anthropics/skills`

## Hinweise

- Nach der Installation neuer Skills ist ein Neustart von Codex noetig, damit
  sie in der Session verfuegbar sind.
- Diese Liste kann spaeter um weitere projektbezogene Skills erweitert werden.
