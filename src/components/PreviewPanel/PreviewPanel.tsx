import { Resume } from './Resume';
import styles from './PreviewPanel.module.css';

export function PreviewPanel() {
  return (
    <div className={styles.container}>
      <Resume />
    </div>
  );
}
