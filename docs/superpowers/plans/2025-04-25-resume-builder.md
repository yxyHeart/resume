# 简历生成页面 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个中文简历生成页面，左侧表单填写、右侧 A4 实时预览、一键导出 PDF。

**Architecture:** React 18 + TypeScript + Vite 单页应用。左侧 FormPanel 管理表单输入，右侧 PreviewPanel 渲染 A4 简历预览。状态通过 Context + useReducer 集中管理，表单 dispatch 更新，预览组件读取渲染。PDF 导出使用 html2pdf.js。

**Tech Stack:** React 18, TypeScript, Vite, CSS Modules, html2pdf.js

---

## File Structure

```
src/
├── main.tsx                    # 入口，挂载 App
├── App.tsx                     # 根组件，左右分栏布局
├── App.module.css
├── types.ts                    # ResumeData 类型定义
├── context/
│   ├── ResumeContext.tsx        # Context + Provider + useResume hook
│   └── reducer.ts              # useReducer 的 reducer + action types
├── components/
│   ├── FormPanel/
│   │   ├── FormPanel.tsx       # 左侧表单容器
│   │   ├── FormPanel.module.css
│   │   ├── BasicInfoForm.tsx   # 基本信息
│   │   ├── BasicInfoForm.module.css
│   │   ├── EducationForm.tsx   # 教育背景（多条）
│   │   ├── WorkForm.tsx        # 工作经历（多条）
│   │   ├── ProjectForm.tsx     # 项目经历（多条）
│   │   ├── ListSection.tsx     # 多条记录的通用增删容器
│   │   ├── ListSection.module.css
│   │   └── SkillsForm.tsx      # 专业技能
│   ├── PreviewPanel/
│   │   ├── PreviewPanel.tsx    # 右侧预览容器
│   │   ├── PreviewPanel.module.css
│   │   ├── Resume.tsx          # 简历渲染（A4）
│   │   └── Resume.module.css
│   └── Toolbar/
│       ├── Toolbar.tsx         # 导出按钮工具栏
│       └── Toolbar.module.css
└── utils/
    └── exportPdf.ts            # html2pdf.js 导出逻辑
```

---

### Task 1: 项目初始化

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/App.module.css`

- [ ] **Step 1: 用 Vite 创建 React + TypeScript 项目**

```bash
cd /Users/yxy/Desktop/resume
npm create vite@latest . -- --template react-ts
npm install
```

- [ ] **Step 2: 安装 html2pdf.js**

```bash
npm install html2pdf.js
```

- [ ] **Step 3: 替换 App.tsx 为左右分栏骨架**

`src/App.tsx`:
```tsx
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.formPanel}>表单区</div>
      <div className={styles.previewPanel}>预览区</div>
    </div>
  );
}

export default App;
```

`src/App.module.css`:
```css
.container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.formPanel {
  width: 40%;
  background: #f5f5f5;
  overflow-y: auto;
  padding: 24px;
  box-sizing: border-box;
}

.previewPanel {
  width: 60%;
  background: #e8e8e8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}
```

- [ ] **Step 4: 清理 Vite 模板多余文件**

```bash
rm -f src/index.css src/assets/react.svg public/vite.svg
```

移除 `main.tsx` 中对 `index.css` 的 import（如果有的话）。

- [ ] **Step 5: 启动开发服务器验证**

```bash
npm run dev
```

Expected: 浏览器打开后看到左右分栏，左侧灰色"表单区"，右侧灰色"预览区"。

- [ ] **Step 6: Commit**

```bash
git init
git add -A
git commit -m "feat: init Vite + React + TypeScript project with split layout"
```

---

### Task 2: 类型定义与状态管理

**Files:**
- Create: `src/types.ts`, `src/context/reducer.ts`, `src/context/ResumeContext.tsx`

- [ ] **Step 1: 创建类型定义**

`src/types.ts`:
```ts
export interface BasicInfo {
  name: string;
  phone: string;
  email: string;
  city: string;
  objective: string;
}

export interface EducationItem {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface WorkItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeData {
  basicInfo: BasicInfo;
  education: EducationItem[];
  work: WorkItem[];
  projects: ProjectItem[];
  skills: string;
}

export type SectionKey = 'education' | 'work' | 'projects';
```

- [ ] **Step 2: 创建 reducer**

`src/context/reducer.ts`:
```ts
import type { ResumeData, BasicInfo, SectionKey } from '../types';

type Action =
  | { type: 'UPDATE_BASIC'; payload: Partial<BasicInfo> }
  | { type: 'ADD_ITEM'; payload: { section: SectionKey; item: ResumeData[SectionKey][number] } }
  | { type: 'REMOVE_ITEM'; payload: { section: SectionKey; id: string } }
  | { type: 'UPDATE_ITEM'; payload: { section: SectionKey; id: string; data: Partial<ResumeData[SectionKey][number]> } }
  | { type: 'UPDATE_SKILLS'; payload: string };

export const initialResumeData: ResumeData = {
  basicInfo: { name: '', phone: '', email: '', city: '', objective: '' },
  education: [],
  work: [],
  projects: [],
  skills: '',
};

export function resumeReducer(state: ResumeData, action: Action): ResumeData {
  switch (action.type) {
    case 'UPDATE_BASIC':
      return { ...state, basicInfo: { ...state.basicInfo, ...action.payload } };
    case 'ADD_ITEM':
      return { ...state, [action.payload.section]: [...state[action.payload.section], action.payload.item] };
    case 'REMOVE_ITEM':
      return { ...state, [action.payload.section]: state[action.payload.section].filter((item: { id: string }) => item.id !== action.payload.id) };
    case 'UPDATE_ITEM':
      return {
        ...state,
        [action.payload.section]: state[action.payload.section].map((item: { id: string }) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case 'UPDATE_SKILLS':
      return { ...state, skills: action.payload };
    default:
      return state;
  }
}
```

- [ ] **Step 3: 创建 Context + Provider + hook**

`src/context/ResumeContext.tsx`:
```tsx
import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { ResumeData } from '../types';
import { resumeReducer, initialResumeData } from './reducer';

type ResumeAction = Parameters<typeof resumeReducer>[1];

const ResumeStateContext = createContext<ResumeData>(initialResumeData);
const ResumeDispatchContext = createContext<Dispatch<ResumeAction>>(() => {});

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, initialResumeData);
  return (
    <ResumeStateContext.Provider value={state}>
      <ResumeDispatchContext.Provider value={dispatch}>
        {children}
      </ResumeDispatchContext.Provider>
    </ResumeStateContext.Provider>
  );
}

export function useResumeState() {
  return useContext(ResumeStateContext);
}

export function useResumeDispatch() {
  return useContext(ResumeDispatchContext);
}
```

- [ ] **Step 4: 在 App.tsx 中包裹 Provider**

更新 `src/App.tsx`:
```tsx
import styles from './App.module.css';
import { ResumeProvider } from './context/ResumeContext';

function App() {
  return (
    <ResumeProvider>
      <div className={styles.container}>
        <div className={styles.formPanel}>表单区</div>
        <div className={styles.previewPanel}>预览区</div>
      </div>
    </ResumeProvider>
  );
}

export default App;
```

- [ ] **Step 5: 验证编译通过**

```bash
npx tsc --noEmit
```

Expected: 无错误。

- [ ] **Step 6: Commit**

```bash
git add src/types.ts src/context/
git add src/App.tsx
git commit -m "feat: add ResumeData types, reducer, and Context provider"
```

---

### Task 3: 表单组件 — 基本信息

**Files:**
- Create: `src/components/FormPanel/BasicInfoForm.tsx`, `src/components/FormPanel/BasicInfoForm.module.css`

- [ ] **Step 1: 创建 BasicInfoForm 组件**

`src/components/FormPanel/BasicInfoForm.tsx`:
```tsx
import { useResumeState, useResumeDispatch } from '../../context/ResumeContext';
import styles from './BasicInfoForm.module.css';

export function BasicInfoForm() {
  const { basicInfo } = useResumeState();
  const dispatch = useResumeDispatch();

  const handleChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_BASIC', payload: { [field]: value } });
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>基本信息</h3>
      <label className={styles.label}>
        姓名
        <input
          className={styles.input}
          value={basicInfo.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="张三"
        />
      </label>
      <label className={styles.label}>
        电话
        <input
          className={styles.input}
          value={basicInfo.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="138xxxx xxxx"
        />
      </label>
      <label className={styles.label}>
        邮箱
        <input
          className={styles.input}
          value={basicInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="example@mail.com"
        />
      </label>
      <label className={styles.label}>
        城市
        <input
          className={styles.input}
          value={basicInfo.city}
          onChange={(e) => handleChange('city', e.target.value)}
          placeholder="深圳"
        />
      </label>
      <label className={styles.label}>
        求职意向
        <input
          className={styles.input}
          value={basicInfo.objective}
          onChange={(e) => handleChange('objective', e.target.value)}
          placeholder="前端工程师"
        />
      </label>
    </div>
  );
}
```

`src/components/FormPanel/BasicInfoForm.module.css`:
```css
.section {
  margin-bottom: 24px;
}

.title {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
}

.label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.input {
  display: block;
  width: 100%;
  margin-top: 4px;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  background: #fff;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #666;
}
```

- [ ] **Step 2: 验证编译通过**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FormPanel/
git commit -m "feat: add BasicInfoForm component"
```

---

### Task 4: 通用多条记录容器 ListSection

**Files:**
- Create: `src/components/FormPanel/ListSection.tsx`, `src/components/FormPanel/ListSection.module.css`

- [ ] **Step 1: 创建 ListSection 组件**

这是教育背景、工作经历、项目经历的通用增删容器。

`src/components/FormPanel/ListSection.tsx`:
```tsx
import type { ReactNode } from 'react';
import styles from './ListSection.module.css';

interface ListSectionProps {
  title: string;
  items: { id: string }[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  renderItem: (item: { id: string }, index: number) => ReactNode;
}

export function ListSection({ title, items, onAdd, onRemove, renderItem }: ListSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <button className={styles.addBtn} type="button" onClick={onAdd}>+ 添加</button>
      </div>
      {items.map((item, index) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.itemContent}>
            {renderItem(item, index)}
          </div>
          <button
            className={styles.removeBtn}
            type="button"
            onClick={() => onRemove(item.id)}
            title="删除"
          >
            ×
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <p className={styles.empty}>暂无内容，点击上方「添加」</p>
      )}
    </div>
  );
}
```

`src/components/FormPanel/ListSection.module.css`:
```css
.section {
  margin-bottom: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  margin-bottom: 12px;
}

.title {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.addBtn {
  font-size: 12px;
  color: #555;
  background: none;
  border: 1px solid #bbb;
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
}

.addBtn:hover {
  background: #e5e5e5;
}

.item {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.itemContent {
  flex: 1;
}

.removeBtn {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.removeBtn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.empty {
  font-size: 12px;
  color: #aaa;
  text-align: center;
  margin: 8px 0;
}
```

- [ ] **Step 2: 验证编译通过**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FormPanel/ListSection.tsx src/components/FormPanel/ListSection.module.css
git commit -m "feat: add ListSection component for multi-item forms"
```

---

### Task 5: 表单组件 — 教育背景、工作经历、项目经历、专业技能

**Files:**
- Create: `src/components/FormPanel/EducationForm.tsx`, `src/components/FormPanel/WorkForm.tsx`, `src/components/FormPanel/ProjectForm.tsx`, `src/components/FormPanel/SkillsForm.tsx`

- [ ] **Step 1: 创建 EducationForm**

`src/components/FormPanel/EducationForm.tsx`:
```tsx
import { useResumeState, useResumeDispatch } from '../../context/ResumeContext';
import { ListSection } from './ListSection';
import styles from './BasicInfoForm.module.css';

let nextId = 1;

export function EducationForm() {
  const { education } = useResumeState();
  const dispatch = useResumeDispatch();

  const handleAdd = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { section: 'education', item: { id: `edu-${nextId++}`, school: '', major: '', degree: '本科', startDate: '', endDate: '' } },
    });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { section: 'education', id } });
  };

  const handleUpdate = (id: string, data: Record<string, string>) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { section: 'education', id, data } });
  };

  return (
    <ListSection title="教育背景" items={education} onAdd={handleAdd} onRemove={handleRemove}
      renderItem={(item) => (
        <>
          <label className={styles.label}>学校
            <input className={styles.input} value={item.school} onChange={(e) => handleUpdate(item.id, { school: e.target.value })} placeholder="XX大学" />
          </label>
          <label className={styles.label}>专业
            <input className={styles.input} value={item.major} onChange={(e) => handleUpdate(item.id, { major: e.target.value })} placeholder="计算机科学与技术" />
          </label>
          <label className={styles.label}>学历
            <select className={styles.input} value={item.degree} onChange={(e) => handleUpdate(item.id, { degree: e.target.value })}>
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
              <option value="其他">其他</option>
            </select>
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <label className={styles.label} style={{ flex: 1 }}>开始时间
              <input className={styles.input} value={item.startDate} onChange={(e) => handleUpdate(item.id, { startDate: e.target.value })} placeholder="2018.09" />
            </label>
            <label className={styles.label} style={{ flex: 1 }}>结束时间
              <input className={styles.input} value={item.endDate} onChange={(e) => handleUpdate(item.id, { endDate: e.target.value })} placeholder="2022.06" />
            </label>
          </div>
        </>
      )}
    />
  );
}
```

- [ ] **Step 2: 创建 WorkForm**

`src/components/FormPanel/WorkForm.tsx`:
```tsx
import { useResumeState, useResumeDispatch } from '../../context/ResumeContext';
import { ListSection } from './ListSection';
import styles from './BasicInfoForm.module.css';

let nextId = 1;

export function WorkForm() {
  const { work } = useResumeState();
  const dispatch = useResumeDispatch();

  const handleAdd = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { section: 'work', item: { id: `work-${nextId++}`, company: '', position: '', startDate: '', endDate: '', description: '' } },
    });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { section: 'work', id } });
  };

  const handleUpdate = (id: string, data: Record<string, string>) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { section: 'work', id, data } });
  };

  return (
    <ListSection title="工作经历" items={work} onAdd={handleAdd} onRemove={handleRemove}
      renderItem={(item) => (
        <>
          <label className={styles.label}>公司
            <input className={styles.input} value={item.company} onChange={(e) => handleUpdate(item.id, { company: e.target.value })} placeholder="XX科技有限公司" />
          </label>
          <label className={styles.label}>职位
            <input className={styles.input} value={item.position} onChange={(e) => handleUpdate(item.id, { position: e.target.value })} placeholder="前端工程师" />
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <label className={styles.label} style={{ flex: 1 }}>开始时间
              <input className={styles.input} value={item.startDate} onChange={(e) => handleUpdate(item.id, { startDate: e.target.value })} placeholder="2022.07" />
            </label>
            <label className={styles.label} style={{ flex: 1 }}>结束时间
              <input className={styles.input} value={item.endDate} onChange={(e) => handleUpdate(item.id, { endDate: e.target.value })} placeholder="至今" />
            </label>
          </div>
          <label className={styles.label}>工作描述
            <textarea className={styles.input} value={item.description} onChange={(e) => handleUpdate(item.id, { description: e.target.value })} placeholder="负责核心产品前端开发与优化..." rows={3} />
          </label>
        </>
      )}
    />
  );
}
```

- [ ] **Step 3: 创建 ProjectForm**

`src/components/FormPanel/ProjectForm.tsx`:
```tsx
import { useResumeState, useResumeDispatch } from '../../context/ResumeContext';
import { ListSection } from './ListSection';
import styles from './BasicInfoForm.module.css';

let nextId = 1;

export function ProjectForm() {
  const { projects } = useResumeState();
  const dispatch = useResumeDispatch();

  const handleAdd = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { section: 'projects', item: { id: `proj-${nextId++}`, name: '', role: '', startDate: '', endDate: '', description: '' } },
    });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { section: 'projects', id } });
  };

  const handleUpdate = (id: string, data: Record<string, string>) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { section: 'projects', id, data } });
  };

  return (
    <ListSection title="项目经历" items={projects} onAdd={handleAdd} onRemove={handleRemove}
      renderItem={(item) => (
        <>
          <label className={styles.label}>项目名称
            <input className={styles.input} value={item.name} onChange={(e) => handleUpdate(item.id, { name: e.target.value })} placeholder="XX管理平台" />
          </label>
          <label className={styles.label}>角色
            <input className={styles.input} value={item.role} onChange={(e) => handleUpdate(item.id, { role: e.target.value })} placeholder="核心开发者" />
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <label className={styles.label} style={{ flex: 1 }}>开始时间
              <input className={styles.input} value={item.startDate} onChange={(e) => handleUpdate(item.id, { startDate: e.target.value })} placeholder="2023.01" />
            </label>
            <label className={styles.label} style={{ flex: 1 }}>结束时间
              <input className={styles.input} value={item.endDate} onChange={(e) => handleUpdate(item.id, { endDate: e.target.value })} placeholder="2023.06" />
            </label>
          </div>
          <label className={styles.label}>项目描述
            <textarea className={styles.input} value={item.description} onChange={(e) => handleUpdate(item.id, { description: e.target.value })} placeholder="独立负责前端架构设计与核心模块开发..." rows={3} />
          </label>
        </>
      )}
    />
  );
}
```

- [ ] **Step 4: 创建 SkillsForm**

`src/components/FormPanel/SkillsForm.tsx`:
```tsx
import { useResumeState, useResumeDispatch } from '../../context/ResumeContext';
import styles from './BasicInfoForm.module.css';

export function SkillsForm() {
  const { skills } = useResumeState();
  const dispatch = useResumeDispatch();

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>专业技能</h3>
      <label className={styles.label}>
        技能（用 / 分隔）
        <input
          className={styles.input}
          value={skills}
          onChange={(e) => dispatch({ type: 'UPDATE_SKILLS', payload: e.target.value })}
          placeholder="JavaScript / React / TypeScript / Node.js"
        />
      </label>
    </div>
  );
}
```

- [ ] **Step 5: 创建 FormPanel 容器并组装所有表单**

`src/components/FormPanel/FormPanel.tsx`:
```tsx
import { BasicInfoForm } from './BasicInfoForm';
import { EducationForm } from './EducationForm';
import { WorkForm } from './WorkForm';
import { ProjectForm } from './ProjectForm';
import { SkillsForm } from './SkillsForm';

export function FormPanel() {
  return (
    <>
      <BasicInfoForm />
      <EducationForm />
      <WorkForm />
      <ProjectForm />
      <SkillsForm />
    </>
  );
}
```

- [ ] **Step 6: 将 FormPanel 接入 App.tsx**

更新 `src/App.tsx` 中左侧区域：
```tsx
import { FormPanel } from './components/FormPanel/FormPanel';
// ...
<div className={styles.formPanel}><FormPanel /></div>
```

- [ ] **Step 7: 验证开发服务器运行正常**

```bash
npm run dev
```

在浏览器中测试：填写基本信息、添加/删除教育背景条目，确认表单交互正常。

- [ ] **Step 8: Commit**

```bash
git add src/components/FormPanel/
git add src/App.tsx
git commit -m "feat: add all form components (basic, education, work, project, skills)"
```

---

### Task 6: 简历预览组件

**Files:**
- Create: `src/components/PreviewPanel/PreviewPanel.tsx`, `src/components/PreviewPanel/PreviewPanel.module.css`, `src/components/PreviewPanel/Resume.tsx`, `src/components/PreviewPanel/Resume.module.css`

- [ ] **Step 1: 创建 Resume 组件（A4 简历渲染）**

`src/components/PreviewPanel/Resume.tsx`:
```tsx
import { useRef } from 'react';
import { useResumeState } from '../../context/ResumeContext';
import styles from './Resume.module.css';

export function Resume() {
  const data = useResumeState();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className={styles.resume} id="resume-preview">
      {/* 基本信息 */}
      <div className={styles.header}>
        <h1 className={styles.name}>{data.basicInfo.name || '姓名'}</h1>
        {(data.basicInfo.phone || data.basicInfo.email || data.basicInfo.city) && (
          <p className={styles.contact}>
            {[data.basicInfo.phone, data.basicInfo.email, data.basicInfo.city].filter(Boolean).join(' · ')}
          </p>
        )}
        {data.basicInfo.objective && (
          <p className={styles.objective}>求职意向：{data.basicInfo.objective}</p>
        )}
      </div>

      {/* 教育背景 */}
      {data.education.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>教育背景</h2>
          {data.education.map((item) => (
            <div key={item.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryTitle}>{item.school}</span>
                <span className={styles.entryDate}>{item.startDate} - {item.endDate}</span>
              </div>
              <div className={styles.entrySub}>{item.major} · {item.degree}</div>
            </div>
          ))}
        </section>
      )}

      {/* 工作经历 */}
      {data.work.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>工作经历</h2>
          {data.work.map((item) => (
            <div key={item.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryTitle}>{item.company}</span>
                <span className={styles.entryDate}>{item.startDate} - {item.endDate}</span>
              </div>
              <div className={styles.entrySub}>{item.position}</div>
              {item.description && <p className={styles.entryDesc}>{item.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* 项目经历 */}
      {data.projects.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>项目经历</h2>
          {data.projects.map((item) => (
            <div key={item.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryTitle}>{item.name}</span>
                <span className={styles.entryDate}>{item.startDate} - {item.endDate}</span>
              </div>
              <div className={styles.entrySub}>{item.role}</div>
              {item.description && <p className={styles.entryDesc}>{item.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* 专业技能 */}
      {data.skills && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>专业技能</h2>
          <p className={styles.skillsText}>
            {data.skills.split(/[/／]/).map((s) => s.trim()).filter(Boolean).join(' · ')}
          </p>
        </section>
      )}
    </div>
  );
}
```

`src/components/PreviewPanel/Resume.module.css`:
```css
.resume {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  padding: 40px 48px;
  box-sizing: border-box;
  font-family: "PingFang SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif;
  color: #333;
  line-height: 1.5;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.name {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #111;
}

.contact {
  font-size: 12px;
  color: #555;
  margin: 6px 0 0;
}

.objective {
  font-size: 12px;
  color: #555;
  margin: 4px 0 0;
}

.section {
  margin-bottom: 16px;
}

.sectionTitle {
  font-size: 14px;
  font-weight: 700;
  color: #111;
  border-bottom: 1px solid #333;
  padding-bottom: 4px;
  margin: 0 0 10px;
}

.entry {
  margin-bottom: 10px;
}

.entryHeader {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.entryTitle {
  font-size: 13px;
  font-weight: 600;
  color: #111;
}

.entryDate {
  font-size: 11px;
  color: #777;
  flex-shrink: 0;
}

.entrySub {
  font-size: 12px;
  color: #555;
  margin-top: 2px;
}

.entryDesc {
  font-size: 11px;
  color: #555;
  margin: 4px 0 0;
  white-space: pre-line;
}

.skillsText {
  font-size: 12px;
  color: #555;
  margin: 0;
}
```

- [ ] **Step 2: 创建 PreviewPanel 容器**

`src/components/PreviewPanel/PreviewPanel.tsx`:
```tsx
import { Resume } from './Resume';
import styles from './PreviewPanel.module.css';

export function PreviewPanel() {
  return (
    <div className={styles.container}>
      <Resume />
    </div>
  );
}
```

`src/components/PreviewPanel/PreviewPanel.module.css`:
```css
.container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  height: 100%;
  padding: 24px;
}

.container :global(#resume-preview) {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}
```

- [ ] **Step 3: 将 PreviewPanel 接入 App.tsx**

更新 `src/App.tsx` 右侧区域：
```tsx
import { PreviewPanel } from './components/PreviewPanel/PreviewPanel';
// ...
<div className={styles.previewPanel}><PreviewPanel /></div>
```

- [ ] **Step 4: 验证开发服务器 — 填写表单后右侧实时更新**

```bash
npm run dev
```

Expected: 左侧填写表单，右侧实时显示简历内容。

- [ ] **Step 5: Commit**

```bash
git add src/components/PreviewPanel/
git add src/App.tsx
git commit -m "feat: add Resume and PreviewPanel components"
```

---

### Task 7: 工具栏与 PDF 导出

**Files:**
- Create: `src/components/Toolbar/Toolbar.tsx`, `src/components/Toolbar/Toolbar.module.css`, `src/utils/exportPdf.ts`

- [ ] **Step 1: 创建 PDF 导出工具函数**

`src/utils/exportPdf.ts`:
```ts
import html2pdf from 'html2pdf.js';

export function exportResumeToPdf(name: string) {
  const element = document.getElementById('resume-preview');
  if (!element) return;

  const filename = `${name || '简历'}-简历.pdf`;

  html2pdf()
    .set({
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(element)
    .save();
}
```

- [ ] **Step 2: 创建 Toolbar 组件**

`src/components/Toolbar/Toolbar.tsx`:
```tsx
import { useResumeState } from '../../context/ResumeContext';
import { exportResumeToPdf } from '../../utils/exportPdf';
import styles from './Toolbar.module.css';

export function Toolbar() {
  const { basicInfo } = useResumeState();

  const handleExport = () => {
    exportResumeToPdf(basicInfo.name);
  };

  return (
    <div className={styles.toolbar}>
      <button className={styles.exportBtn} onClick={handleExport}>
        导出 PDF
      </button>
    </div>
  );
}
```

`src/components/Toolbar/Toolbar.module.css`:
```css
.toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
  margin-bottom: 8px;
}

.exportBtn {
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.exportBtn:hover {
  background: #555;
}
```

- [ ] **Step 3: 将 Toolbar 接入 App.tsx 的右侧预览区顶部**

更新 `src/App.tsx`:
```tsx
import { Toolbar } from './components/Toolbar/Toolbar';
import { FormPanel } from './components/FormPanel/FormPanel';
import { PreviewPanel } from './components/PreviewPanel/PreviewPanel';
import { ResumeProvider } from './context/ResumeContext';
import styles from './App.module.css';

function App() {
  return (
    <ResumeProvider>
      <div className={styles.container}>
        <div className={styles.formPanel}><FormPanel /></div>
        <div className={styles.previewPanel}>
          <Toolbar />
          <PreviewPanel />
        </div>
      </div>
    </ResumeProvider>
  );
}

export default App;
```

更新 `src/App.module.css` 让预览区从顶部排列：
```css
.previewPanel {
  width: 60%;
  background: #e8e8e8;
  display: flex;
  flex-direction: column;
  padding: 0 24px 24px;
  box-sizing: border-box;
  overflow: hidden;
}
```

PreviewPanel.module.css 中的 container 需要占满剩余空间：
```css
.container {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 0 0 24px;
}

.container :global(#resume-preview) {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}
```

- [ ] **Step 4: 验证 — 填写表单后点击导出 PDF**

```bash
npm run dev
```

Expected: 填写姓名等表单后点击「导出 PDF」，浏览器下载 PDF 文件，打开后排版正确。

- [ ] **Step 5: Commit**

```bash
git add src/components/Toolbar/ src/utils/exportPdf.ts src/App.tsx src/App.module.css
git commit -m "feat: add Toolbar and PDF export functionality"
```

---

### Task 8: 最终打磨与全流程验证

**Files:**
- Modify: `src/App.module.css`, `src/components/PreviewPanel/Resume.module.css`

- [ ] **Step 1: 检查 textarea 样式，确保与 input 一致**

在 `BasicInfoForm.module.css` 中追加：
```css
.input[rows] {
  resize: vertical;
  font-family: inherit;
}
```

- [ ] **Step 2: 验证全流程**

```bash
npm run dev
```

测试清单：
1. 页面正常渲染，左右分栏
2. 填写基本信息 — 右侧实时更新姓名和联系方式
3. 添加 2 条教育背景 — 右侧显示教育板块
4. 添加 1 条工作经历 — 右侧显示工作板块
5. 添加 1 条项目经历 — 右侧显示项目板块
6. 输入技能 — 右侧用「·」分隔显示
7. 删除一条教育背景 — 右侧同步移除
8. 点击导出 PDF — 文件下载，内容完整排版正确
9. 清空所有表单 — 预览仅显示「姓名」占位

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: final polish and style adjustments"
```

---

## Verification

1. `npm run dev` 启动，浏览器验证全屏左右分栏
2. 填写所有表单板块，右侧 A4 预览实时响应
3. 增删多条记录操作正常
4. 技能输入用 `/` 分隔，预览自动转为 `·` 分隔
5. 导出 PDF 内容完整、A4 尺寸、黑白灰配色
6. 空状态下预览不报错，显示占位内容
