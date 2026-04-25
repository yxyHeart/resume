import type { ResumeData, BasicInfo, SectionKey } from '../types';

type Action =
  | { type: 'UPDATE_BASIC'; payload: Partial<BasicInfo> }
  | { type: 'ADD_ITEM'; payload: { section: SectionKey; item: ResumeData[SectionKey][number] } }
  | { type: 'REMOVE_ITEM'; payload: { section: SectionKey; id: string } }
  | { type: 'UPDATE_ITEM'; payload: { section: SectionKey; id: string; data: Partial<ResumeData[SectionKey][number]> } }
  | { type: 'LOAD'; payload: ResumeData };

export const initialResumeData: ResumeData = {
  basicInfo: {
    name: '张三',
    phone: '138-0000-0000',
    email: 'zhangsan@example.com',
    city: '深圳',
    objective: '前端工程师',
  },
  education: [
    { id: 'edu-1', school: '深圳大学', major: '计算机科学与技术', degree: '本科', startDate: '2018.09', endDate: '2022.06' },
  ],
  work: [
    { id: 'work-1', company: '字节跳动', position: '前端工程师', startDate: '2022.07', endDate: '至今', description: '负责公司核心产品的前端开发与性能优化，使用 React + TypeScript 构建用户界面，推动前端工程化建设。' },
    { id: 'work-2', company: '华为', position: '前端实习生', startDate: '2021.06', endDate: '2022.03', description: '参与终端云服务 Web 端开发，协助完成组件库迁移与单元测试覆盖。' },
  ],
  projects: [
    { id: 'proj-1', name: '数据管理平台', role: '前端负责人', startDate: '2023.01', endDate: '2023.06', description: '独立负责平台前端架构设计与核心模块开发，实现可视化数据看板与权限管理系统。' },
  ],
  skills: [
    { id: 'skill-1', name: 'JavaScript / TypeScript' },
    { id: 'skill-2', name: 'React / Vue' },
    { id: 'skill-3', name: 'Node.js / Express' },
    { id: 'skill-4', name: 'Git / Webpack / Vite' },
  ],
};

export function resumeReducer(state: ResumeData, action: Action): ResumeData {
  switch (action.type) {
    case 'UPDATE_BASIC':
      return { ...state, basicInfo: { ...state.basicInfo, ...action.payload } };
    case 'ADD_ITEM':
      return { ...state, [action.payload.section]: [...state[action.payload.section], action.payload.item] };
    case 'REMOVE_ITEM':
      return {
        ...state,
        [action.payload.section]: (state[action.payload.section] as Array<{ id: string }>).filter(
          (item) => item.id !== action.payload.id
        ),
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        [action.payload.section]: (state[action.payload.section] as Array<{ id: string }>).map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case 'LOAD':
      return action.payload;
    default:
  }
}
