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

export interface SkillItem {
  id: string;
  name: string;
}

export interface ResumeData {
  basicInfo: BasicInfo;
  education: EducationItem[];
  work: WorkItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
}

export type SectionKey = 'education' | 'work' | 'projects' | 'skills';
