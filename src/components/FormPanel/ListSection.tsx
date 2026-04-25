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
