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
