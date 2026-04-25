import { useResumeState, useResumeDispatch } from '../../context/ResumeContext';
import { ListSection } from './ListSection';
import styles from './BasicInfoForm.module.css';

let nextId = 1;

export function SkillsForm() {
  const { skills } = useResumeState();
  const dispatch = useResumeDispatch();

  const handleAdd = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { section: 'skills', item: { id: `skill-${nextId++}`, name: '' } },
    });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { section: 'skills', id } });
  };

  const handleUpdate = (id: string, data: Record<string, string>) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { section: 'skills', id, data } });
  };

  return (
    <ListSection title="专业技能" items={skills} onAdd={handleAdd} onRemove={handleRemove}
      renderItem={(item) => (
        <label className={styles.label}>技能
          <input className={styles.input} value={item.name} onChange={(e) => handleUpdate(item.id, { name: e.target.value })} placeholder="JavaScript / React / TypeScript" />
        </label>
      )}
    />
  );
}
