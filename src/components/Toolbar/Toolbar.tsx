import { useResumeState, useResumeDispatch } from '../../context/ResumeContext';
import { exportResumeToPdf } from '../../utils/exportPdf';
import styles from './Toolbar.module.css';

export function Toolbar() {
  const state = useResumeState();
  const dispatch = useResumeDispatch();

  const handleExport = () => {
    exportResumeToPdf(state.basicInfo.name);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.basicInfo.name || 'resume'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        dispatch({ type: 'LOAD', payload: data });
      } catch {
        alert('文件格式错误，请选择有效的 JSON 文件');
      }
    };
    input.click();
  };

  return (
    <div className={styles.toolbar}>
      <button className={styles.btn} onClick={handleImportJson}>
        导入 JSON
      </button>
      <button className={styles.btn} onClick={handleExportJson}>
        导出 JSON
      </button>
      <button className={styles.exportBtn} onClick={handleExport}>
        导出 PDF
      </button>
    </div>
  );
}
