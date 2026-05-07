# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Resume builder web app — React 19 + TypeScript + Vite. Split-pane layout: left panel (40%) for form inputs, right panel (60%) for live A4-proportioned preview with PDF export. Ships with Chinese-language sample data.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Type-check then build for production (`tsc -b && vite build`)
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint on all `.ts`/`.tsx` files

No test framework is configured.

## Architecture

**State management**: Single `ResumeData` managed via `useReducer` + React Context (`ResumeProvider` in `src/context/`). Two separate contexts are exposed — `ResumeStateContext` and `ResumeDispatchContext` — so read-only components (like `Resume`) don't re-render on dispatches from sibling components. Hooks: `useResumeState()`, `useResumeDispatch()`.

**Reducer** (`src/context/reducer.ts`): Five action types — `UPDATE_BASIC` (shallow-merge into `basicInfo`), `ADD_ITEM`/`REMOVE_ITEM`/`UPDATE_ITEM` (generic over `SectionKey: 'education' | 'work' | 'projects' | 'skills'`), and `LOAD` (full state replacement, used for JSON import). IDs are `crypto.randomUUID()`.

**localStorage persistence**: State auto-saves to `localStorage` on every change and hydrates on mount. `loadFromStorage()` runs a `dedupeIds()` guard to fix duplicate IDs from manual JSON edits.

**ListSection render-prop pattern** (`src/components/FormPanel/ListSection.tsx`): Reusable component that encapsulates the add/remove/list UI. All four list sections (education, work, projects, skills) consume it by providing `onAdd`, `onRemove`, and a `renderItem` function.

**CSS sharing quirk**: `BasicInfoForm.module.css` serves as the shared form styles (`.label`, `.input`, etc.) for all list-based form components — they import it directly rather than having a separate shared CSS module.

**PDF export** (`src/utils/exportPdf.ts`): Uses `html2canvas` + `jsPDF` directly (not `html2pdf.js`, despite it being in `package.json`). Temporarily removes `minHeight` from the resume element before capture to avoid blank space in the PDF, then restores it in a `finally` block.

**Toolbar** (`src/components/Toolbar/`): Three buttons — Import JSON (dispatches `LOAD`), Export JSON (serializes state), Export PDF. Uses `useResumeState()` for the applicant's name in filenames.

**CompanyIcon** (`src/components/CompanyIcon.tsx`): Renders branded badges next to company names. Used in both `WorkForm` (24px) and `Resume` preview (20px). `src/utils/companyLogo.ts` maps known company names (Chinese + English variants) to colors/logos; unknown companies get a gray initial badge.

**Markdown rendering**: Work and project descriptions are rendered via `<ReactMarkdown remarkPlugins={[remarkGfm]}>` in `Resume.tsx`. The sample data in `reducer.ts` uses Markdown formatting (bold, code, lists). `Resume.module.css` styles the generated Markdown elements (`.entryDesc p`, `.entryDesc ul`, etc.).

**Key types**: `ResumeData` in `src/types.ts` aggregates `BasicInfo` (no `id`) plus four `SectionKey` arrays (`EducationItem`, `WorkItem`, `ProjectItem`, `SkillItem` — all with `id`).

**Styling**: CSS Modules (`*.module.css`), no global CSS framework. Resume preview uses A4 dimensions (210mm × 297mm) with a Chinese font stack.

**Known issues**: Reducer `default` case in `src/context/reducer.ts` returns `undefined` instead of `state` — an unrecognized action would wipe all state. PDF export is single-page only; overflowing content gets cut off.
