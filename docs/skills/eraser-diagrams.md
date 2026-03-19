# eraser-diagrams

## Status

- installed
- relevant to this project
- assigned to the documentation agent for diagram-focused work

## Installation

Installed via:

```bash
npx skills add eraserlabs/eraser-io --yes --global
```

Installed location:

- `~/.agents/skills/eraser-diagrams`

Note:

- The `eraser-io` repository installed a bundle of 5 skills
- for this project, `eraser-diagrams` is the primary relevant skill
- additional installed skills from the same bundle are infrastructure-oriented and not currently assigned to a project agent

## Purpose In This Project

The `eraser-diagrams` skill is useful for:

- generating Eraser diagram DSL from architecture descriptions
- improving architecture and flow diagrams
- documenting the system visually
- creating clearer diagrams from code structure or process flows

## Why It Is Useful Here

This project already includes:

- `docs/diagrams/architecture.eraserdiagram`
- `docs/diagrams/planner-flow.eraserdiagram`

The skill is a strong fit because it focuses specifically on turning code,
architecture, or descriptions into cleaner Eraser diagrams.

## Practical Impact

Based on the installed skill guidance, the current diagrams can benefit from:

- simple, single-line labels
- cleaner node and connection formatting
- stricter diagram-type alignment
- more readable architecture and flow structure

## Constraints

- the skill requires network access to call the Eraser API
- it also requires an `ERASER_API_KEY` for API-based rendering workflows
- without that API workflow, it is still useful as a reference for better Eraser DSL structure

## Notes

- This skill is more suitable for the documentation agent than for the frontend or backend agent.
- It should be used when the task is about architecture visualization, process diagrams, or improving `.eraserdiagram` files.
