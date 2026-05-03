import { useResumeState, useResumeDispatch } from '../../context/ResumeContext';
import { ListSection } from './ListSection';
import styles from './BasicInfoForm.module.css';

export function ProjectForm() {
  const { projects } = useResumeState();
  const dispatch = useResumeDispatch();

  const handleAdd = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { section: 'projects', item: { id: crypto.randomUUID(), name: '', role: '', startDate: '', endDate: '', description: '' } },
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
