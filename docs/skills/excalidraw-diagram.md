# excalidraw-diagram

## Status

- installed
- relevant to this project
- assigned to the documentation agent for Excalidraw-based diagram work

## Installation

Installed via:

```bash
npx skills add https://github.com/coleam00/excalidraw-diagram-skill --yes --global
```

Installed location:

- `~/.agents/skills/excalidraw-diagram`

## Purpose In This Project

The `excalidraw-diagram` skill is useful for:

- creating `.excalidraw` JSON files from architecture or workflow descriptions
- producing presentation-ready diagrams outside the Eraser DSL workflow
- turning technical structure into clearer visual arguments
- preparing diagrams that are easier to share in visual reviews or docs

## Why It Is Useful Here

This project already documents architecture and planning flow with Eraser files.
The Excalidraw skill adds a second diagram option when we want:

- more expressive visuals
- stronger visual storytelling
- diagrams for presentations or screenshots
- an alternative to repo-native `.eraserdiagram` files

## Practical Impact

Based on the installed skill guidance, it is a good fit when the diagram should:

- explain a system, not just list boxes
- show flow and causality more clearly
- include concrete examples or evidence artifacts
- be exported or shared as a polished visual

Current project outputs created with this skill:

- `docs/diagrams/architecture.excalidraw`
- `docs/diagrams/planner-flow.excalidraw`

## Project Defaults For Readability

To reduce visually clipped text in VS Code and Excalidraw previews, this
project should use conservative text sizing by default:

- box text: `14` to `16`
- decision text: `14` to `16`
- section titles: `18` to `20`
- main diagram title: `24` to `28`

Additional layout rules:

- prefer slightly taller boxes over tighter text
- leave visible vertical padding inside containers
- break long labels into two short lines instead of forcing one wide line
- avoid dense text blocks inside narrow shapes
- when in doubt, reduce font size before reducing box padding

These defaults should be treated as the project baseline for future
`.excalidraw` diagrams.

## Notes

- This skill is more suitable for the documentation agent than for the frontend or backend agent.
- It complements `eraser-diagrams` rather than replacing it.
- `eraser-diagrams` remains the better fit for repo-native `.eraserdiagram` maintenance.
