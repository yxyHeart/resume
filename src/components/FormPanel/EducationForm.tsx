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
