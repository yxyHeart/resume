# 简历生成页面 — 设计文档

## Context

需要一个简洁的中文简历生成工具。用户在左侧表单填写内容，右侧实时预览 A4 简历，点击按钮导出为 PDF。面向中国大陆求职场景，经典单栏排版风格。

## 技术选型

- **框架**: React 18 + TypeScript + Vite
- **PDF 导出**: html2pdf.js
- **样式**: CSS Modules（Vite 内置支持）
- **状态管理**: React Context + useReducer
- **无持久化**: 状态仅存内存，YAGNI

## 页面布局

左右分栏，全屏展示：

- **左侧（~40%）**: 可滚动表单区域，深灰背景
- **右侧（~60%）**: 居中显示 A4 比例简历预览，浅灰背景
- **顶部工具栏**: 固定在右侧预览区上方，含「导出 PDF」按钮

## 简历样式（经典单栏）

A4 比例（210mm × 297mm），白色背景：

1. **顶部**: 姓名居中大号粗体，下方一行展示联系方式（电话 · 邮箱 · 城市）
2. **板块分隔**: 细横线（1px #333），板块标题左对齐加粗
3. **经历条目**: 时间倒序排列，公司/学校名加粗，职位/专业常规字重，时间右对齐，描述小号字
4. **技能**: 标签式展示，用「·」分隔
5. **字体**: `"PingFang SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif`
6. **配色**: 纯黑白灰，无彩色元素

## 表单板块

### 1. 基本信息
- 姓名（必填）、电话、邮箱、城市
- 求职意向

### 2. 教育背景（多条，支持增删）
- 学校、专业、学历（本科/硕士/博士/其他）、时间段（起止年月）

### 3. 工作经历（多条，支持增删）
- 公司、职位、时间段、工作描述（多行文本）

### 4. 项目经历（多条，支持增删）
- 项目名、角色、时间段、描述（多行文本）

### 5. 专业技能
- 单行输入，用「/」或「·」分隔，预览时自动格式化

## 组件结构

```
App
├── FormPanel              // 左侧表单容器（可滚动）
│   ├── BasicInfoForm      // 基本信息
│   ├── EducationForm      // 教育背景（多条）
│   ├── WorkForm           // 工作经历（多条）
│   ├── ProjectForm        // 项目经历（多条）
│   └── SkillsForm         // 专业技能
├── PreviewPanel           // 右侧预览容器
│   └── Resume             // 简历渲染（A4 比例）
└── Toolbar                // 工具栏（导出按钮）
```

## 状态模型

```typescript
interface ResumeData {
  basicInfo: {
    name: string;
    phone: string;
    email: string;
    city: string;
    objective: string;
  };
  education: Array<{
    id: string;
    school: string;
    major: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  work: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string;
}
```

使用 `useReducer` + `Context` 管理，action 类型：`UPDATE_BASIC`、`ADD_ITEM`、`REMOVE_ITEM`、`UPDATE_ITEM`、`UPDATE_SKILLS`。

## PDF 导出

- 使用 html2pdf.js，将 `Resume` 组件的 DOM 节点渲染为 PDF
- 导出时临时移除预览边框，确保 PDF 内容干净
- 文件名格式: `${basicInfo.name || '简历'}-简历.pdf`
- html2pdf.js 配置: margin 0, filename 自定义, image quality 1, html2canvas scale 2

## 验证方案

1. `npm run dev` 启动开发服务器，浏览器访问确认页面正常渲染
2. 在表单中填写各板块数据，验证右侧预览实时更新
3. 测试多条记录的增删操作
4. 点击导出 PDF，验证文件下载且内容完整、排版正确
5. 清空表单后预览应显示空状态
