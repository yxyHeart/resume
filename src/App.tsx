import { Toolbar } from './components/Toolbar/Toolbar';
import { FormPanel } from './components/FormPanel/FormPanel';
import { PreviewPanel } from './components/PreviewPanel/PreviewPanel';
import { ResumeProvider } from './context/ResumeContext';
import styles from './App.module.css';

function App() {
  return (
    <ResumeProvider>
      <div className={styles.container}>
        <div className={styles.formPanel}><FormPanel /></div>
        <div className={styles.previewPanel}>
          <Toolbar />
          <PreviewPanel />
        </div>
      </div>
    </ResumeProvider>
  );
}

export default App;
