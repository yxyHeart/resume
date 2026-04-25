# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Resume builder web app — React 19 + TypeScript + Vite. Split-pane layout: left panel for form inputs, right panel for live preview with PDF export.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Type-check then build for production (`tsc -b && vite build`)
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint on all `.ts`/`.tsx` files

No test framework is configured.

## Architecture

**State management**: Single `ResumeState` managed via `useReducer` + React Context (`ResumeProvider` in `src/context/`). The reducer in `src/context/reducer.ts` handles all updates — basic info fields, and add/remove/update for list sections.

**Component structure**:
- `src/components/FormPanel/` — Editable forms for all resume sections (basic info, education, work experience, projects, skills). Uses a reusable `ListSection` component for the dynamic list sections.
- `src/components/PreviewPanel/` — Renders the live resume preview from context state.
- `src/components/Toolbar/` — PDF export button, calls `src/utils/exportPdf.ts` (uses `html2pdf.js`).
- `src/components/CompanyIcon.tsx` — Displays company logos/initials, with known-company matching in `src/utils/companyLogo.ts`.

**Key types**: All resume data shapes defined in `src/types.ts`.

**Styling**: CSS Modules (`*.module.css`) — one per component, no global CSS framework.
