import { useResumeState, useResumeDispatch } from '../../context/ResumeContext';
import { CompanyIcon } from '../CompanyIcon';
import { ListSection } from './ListSection';
import styles from './BasicInfoForm.module.css';

export function WorkForm() {
  const { work } = useResumeState();
  const dispatch = useResumeDispatch();

  const handleAdd = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: { section: 'work', item: { id: crypto.randomUUID(), company: '', position: '', startDate: '', endDate: '', description: '' } },
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <input className={styles.input} value={item.company} onChange={(e) => handleUpdate(item.id, { company: e.target.value })} placeholder="XX科技有限公司" style={{ flex: 1 }} />
              <CompanyIcon name={item.company} size={24} />
            </div>
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
