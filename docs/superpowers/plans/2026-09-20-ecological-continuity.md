# Ecological Continuity Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans; implement inline with one final independent review.

**Goal:** Keep a finite, evolving microbial food web alive and observable through macrofaunal collapses.
**Architecture:** A bounded Biosphere on the environment grid, integrated with existing compost, plants and grazing; separate visualization and census modules.
**Tech Stack:** Native ES modules, Node assert, vendored Three.js. No dependencies.
**Spec:** docs/superpowers/specs/2026-09-20-ecological-continuity-design.md

## Global Constraints

- 512 cells; three guilds; three variants per guild/cell; 256 colony and 256 microfauna visual instances.
- Simulation advances in the worker at 0.1 s; biosphere at 1 Hz; a day is 160 seconds.
- Save v8; v2–7 migrate once; empty v8 stays empty. No macrofauna respawn or automatic intelligence.
- Biomass transfers close the new subsystem's ledger, including imports/exports.
- Mutations are heritable and independent of environmental targets; tolerances have costs.

## Review Focus

- Empty/corrupt saves must not recreate living populations.
- Import/export and capped cohort replacement must not duplicate or discard material.
- Day/night, prolonged drought and repeated crises must not make reserves immortal.
- Worker snapshot reconstruction must not replace class instances with plain objects.
- Render limits, camera motion and extinct worlds must not alter ecological state.

### Task 1: Reproducible diagnosis and baseline
**Files:** Create `scripts/diagnose-ecology.mjs`, `dist/ecology-census.js`, `scripts/verify-census.mjs`.
**Interfaces:** `census(sim)` returns daily counts, biomass, resources and mortality; CLI seed/days/output options; no simulation mutation.
- [x] Assert census counts empty and inhabited ecosystems, stays read-only and handles missing pre-v8 biosphere.
- [x] Run `node scripts/verify-census.mjs`; expect failure until census exists.
- [x] Implement census with array reductions; diagnostic runner uses fixed initial RNG and steps 1600 × 0.1 per day. Save daily samples and snapshots at declines.
- [x] Run census checks and baseline seeds 1726312000000/1726312000001 for 150 days.
- [x] Commit diagnosis; preserve metrics without claiming all possible seeds are validated.

### Task 2: Finite microbial food web
**Files:** Create `dist/biosphere.js`, `scripts/verify-biosphere.mjs`.
**Interfaces:** `new Biosphere(sim,saved)`, `tick(dt)`, `advance(dt)`, `snapshot()`, `accept(saved)`, `mass()`, `addDetritus(x,z,amount)`, `fertilize()`, `forage(c)`, `graze(c,cell)`; `cells`, `summary`, `totals` exposed read-only to views.
- [x] Test no spontaneous recovery from empty cohorts; recovery from dormant ones; photosynthesis needs light/mineral; nutrient balance over growth, death, mutation and dispersal; costs/selection; JSON continuation; fixed capacities.
- [x] Run `node scripts/verify-biosphere.mjs`; expect missing module then assertions to fail on incomplete mechanisms.
- [x] Implement cohort transfers, independent RNG, local environment costs, bounded descendant mutation/dispersal and conditional dormancy.
- [x] Verify isolated deterministic multi-crisis tests and exact ledger, then commit.

### Task 3: Ecosystem and persistence integration
**Files:** Modify `dist/simulation.js`, `dist/app.js`, `dist/recovery.js`, `scripts/verify.mjs`, migration assertions; create `scripts/verify-biosphere-integration.mjs`.
**Interfaces:** `Ecosystem.biosphere` owns the live class; `snapshot().biosphere` is plain serialized data. `Biosphere.accept` restores the view state without advancing.
- [x] Test v7→v8 migration, empty-v8 persistence, JSON roundtrip across ticks, compost imports and grazing exports, state encoder/decoder.
- [x] Run integration checks RED; initialize/tick/snapshot biosphere, transfer compost, nutrients and grazing, update app version acceptance.
- [x] Re-run integration tests and the full existing suite; update explicit save-version assertions to 8.
- [x] Commit only after tests are green.

### Task 4: Observable colonies and handoff
**Files:** Create `dist/biosphere-visuals.js`; modify `dist/globe.js`, `dist/app.js`, `dist/index.html`, README/roadmaps/package version; add `scripts/verify-biosphere-view.mjs`.
**Interfaces:** `BiosphereVisuals(world).update(time)` updates bounded instance meshes; recovery panel displays guilds, phase, lineage and resources.
- [x] Test class stays read-only with empty/dense state and bounded finite matrices; add UI labels and safe escaped lineage display.
- [x] Run view checks RED; implement geometry and observatory integration; run GREEN.
- [ ] Execute two 150-day integrated worlds and reduced repeated-crisis runs; summarize observations/limits in `docs/V4-BIOSPHERE.md` and reports.
- [x] Full suite, diff check, independent review, fix important findings with regression tests; commit and push feature branch, create draft PR.

## Handoff status

Implementation, full suite and independent review are complete. Integrated runs were interrupted after 70 days each; their daily reports are preserved. The 150-day integrated gate and browser/GPU visual check remain open, so the PR stays draft. Reduced crisis tests cover 228 days. The diagnostic runner now serializes its prior-day snapshot and saves a full checkpoint with each report.
