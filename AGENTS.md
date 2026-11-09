# AGENTS.md

## Generated project

- Identity: `name=vue-scheduler-undo-redo`; `component=scheduler`; `edition=lite`; `target=vue3`.
- Preserve this application and its framework setup when making changes. Use Builder only when deliberately creating a new project.
- Preserve the installed edition, dependencies and lockfiles unless a dependency change is requested.
- Public Builder generation creates a fresh baseline; it does not patch or merge this working tree.

## DayPilot sources

- Inspect the installed edition and version in package metadata/lockfiles or the bundled runtime before editing. Current documentation does not establish support in older installed versions.
- Official tools: Streamable HTTP MCP at <https://mcp.daypilot.org/mcp>; [setup and HTTP alternatives](https://mcp.daypilot.org/); [machine-readable discovery](https://mcp.daypilot.org/llms.txt).
- References: use `search` to find official sources and `fetch` to read them. Preserve edition qualifications and cite canonical source URLs.
- Packages: use `resolve_package` for current official releases when installation or an upgrade is requested. Its result does not establish compatibility with an older installed version or authorize an upgrade.
- Themes: read `theme_manifest`, then pass its revision and a unique CSS prefix to `render_theme`. Load the returned CSS globally and set the component's `theme` to that prefix; check compatibility with the installed component.
- Installed API shape: `node_modules/@daypilot/daypilot-lite-vue/daypilot-vue.min.d.ts`
  - Available after dependency install (`npm install`); this generated starter intentionally has no lockfile.
- Builder settings for this exact target: <https://builder.daypilot.org/api/v1/components/scheduler/settings?edition=lite&target=vue3>
- Builder service entry point: <https://builder.daypilot.org/api/v1>. Read the current catalog revision there and follow its linked OpenAPI and Arazzo contracts for automation.
- For a deliberately new project, use `builder_catalog`, then `validate_project`, then `generate_project` with the same specification and returned digest. Follow the linked MCP contract for download and verification; extract into a new directory. Validation does not install, build or run the app.
- Builder discovery covers only Builder-configurable capabilities; an absent setting does not mean the DayPilot product lacks that API.
- For APIs outside Builder's subset, check the installed typings above and the [official API reference](https://api.daypilot.org/).


## Edition boundary

- This is a Lite project. Do not silently add Pro packages or Pro-only APIs; propose an explicit edition change or a Lite-safe alternative.

## Project commands

- Install: `npm install` (this generated starter intentionally has no lockfile; dependency versions are resolved at install time).
- Development: `npm run dev`.
- Build: `npm run build`.
- Lint: no `lint` script is provided.
- Test: this starter does not provide an executable test suite (no `test` script).
