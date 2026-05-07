# Markdown Rendering for Resume Descriptions

## Context

Work and project descriptions in the resume preview are rendered as plain text with `white-space: pre-line`. This means newlines are preserved but no rich formatting is possible — bullet lists appear as literal `-` characters, bold syntax as literal `**`, etc. Users writing detailed job or project descriptions need basic Markdown rendering to produce well-structured, visually distinct content (bullet lists, bold emphasis, numbered lists).

## Scope

**In scope:** Render Markdown in `WorkItem.description` and `ProjectItem.description` fields in the resume preview (`Resume.tsx`).

**Out of scope:** The `objective` field, education/skills sections, form editing experience (stays as plain textarea), and PDF export pipeline (works transparently).

## Approach

**Library:** `react-markdown` with `remark-gfm` for GFM extensions (strikethrough, task lists, tables).

**Why react-markdown:** Renders directly to React elements (no `dangerouslySetInnerHTML`), built-in XSS safety, declarative API that fits the codebase's React patterns. ~30KB gzipped is acceptable for a single-purpose app.

## Changes

### 1. Install dependencies

```bash
npm install react-markdown remark-gfm
```

### 2. Resume.tsx — Replace plain `<p>` with `<ReactMarkdown>`

Two render points change identically:

**Before** (work ~line 53, projects ~line 70):
```tsx
{item.description && <p className={styles.entryDesc}>{item.description}</p>}
```

**After:**
```tsx
{item.description && (
  <ReactMarkdown className={styles.entryDesc} remarkPlugins={[remarkGfm]}>
    {item.description}
  </ReactMarkdown>
)}
```

Add imports at top of `Resume.tsx`:
```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
```

### 3. Resume.module.css — Style Markdown-generated elements

**Change `.entryDesc`** from `white-space: pre-line` to `white-space: normal` (Markdown renders block HTML; `pre-line` would add spurious line breaks around block elements).

**Add nested selectors** within `.entryDesc` for Markdown-generated HTML:

```css
.entryDesc p {
  margin: 0 0 4px;
}

.entryDesc p:last-child {
  margin-bottom: 0;
}

.entryDesc ul, .entryDesc ol {
  margin: 0 0 4px;
  padding-left: 16px;
}

.entryDesc li {
  margin: 1px 0;
}

.entryDesc strong {
  font-weight: 600;
}

.entryDesc em {
  font-style: italic;
}

.entryDesc code {
  font-family: monospace;
  font-size: 10px;
  background: #f0f0f0;
  padding: 1px 4px;
  border-radius: 2px;
}

.entryDesc a {
  color: #2563eb;
  text-decoration: none;
}
```

All styling inherits the existing `font-size: 11px` and `color: #555` from `.entryDesc`.

### 4. Sample data — Update to demonstrate Markdown

Update `initialResumeData` in `src/context/reducer.ts` to use Markdown syntax in the description fields (e.g., bullet lists with `- `, bold with `**`).

## No changes needed

- **Types** (`src/types.ts`): `description` stays `string`
- **Forms** (`WorkForm.tsx`, `ProjectForm.tsx`): `<textarea>` stays as-is; users type raw Markdown
- **Reducer** (`src/context/reducer.ts`): No action changes
- **PDF export** (`src/utils/exportPdf.ts`): `html2canvas` captures rendered DOM transparently
- **localStorage**: Markdown strings persist as-is

## Verification

1. `npm run dev` — open the app
2. In the work experience form, type Markdown in the description field, e.g.:
   ```
   - 负责核心产品**前端架构**设计与优化
   - 主导 `React` 组件库建设，覆盖 20+ 业务组件

   1. 需求分析
   2. 方案设计
   3. 开发交付
   ```
3. Verify the preview renders: bullet list, bold text, inline code, ordered list
4. Click "Export PDF" — verify the PDF shows the same formatted output
5. Refresh the page — verify Markdown content persists from localStorage
6. Verify non-Markdown plain text descriptions still render correctly (backwards compatibility)
