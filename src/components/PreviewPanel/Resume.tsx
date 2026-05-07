import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useResumeState } from '../../context/ResumeContext';
import { CompanyIcon } from '../CompanyIcon';
import styles from './Resume.module.css';

export function Resume() {
  const data = useResumeState();

  return (
    <div className={styles.resume} id="resume-preview">
      {/* 基本信息 */}
      <div className={styles.header}>
        <h1 className={styles.name}>{data.basicInfo.name || '姓名'}</h1>
        {(data.basicInfo.phone || data.basicInfo.email || data.basicInfo.city) && (
          <p className={styles.contact}>
            {[data.basicInfo.phone, data.basicInfo.email, data.basicInfo.city].filter(Boolean).join(' · ')}
          </p>
        )}
        {data.basicInfo.objective && (
          <p className={styles.objective}>求职意向：{data.basicInfo.objective}</p>
        )}
      </div>

      {/* 教育背景 */}
      {data.education.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><span className={styles.sectionIcon}>🎓</span>教育背景</h2>
          {data.education.map((item) => (
            <div key={item.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryTitle}>{item.school}</span>
                <span className={styles.entryDate}>{item.startDate} - {item.endDate}</span>
              </div>
              <div className={styles.entrySub}>{item.major} · {item.degree}</div>
            </div>
          ))}
        </section>
      )}

      {/* 工作经历 */}
      {data.work.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><span className={styles.sectionIcon}>💼</span>工作经历</h2>
          {data.work.map((item) => (
            <div key={item.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryTitle}>
                  {item.company}
                  <CompanyIcon name={item.company} size={20} />
                </span>
                <span className={styles.entryDate}>{item.startDate} - {item.endDate}</span>
              </div>
              <div className={styles.entrySub}>{item.position}</div>
              {item.description && (
                <div className={styles.entryDesc}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.description}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 项目经历 */}
      {data.projects.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><span className={styles.sectionIcon}>🚀</span>项目经历</h2>
          {data.projects.map((item) => (
            <div key={item.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <span className={styles.entryTitle}>{item.name}</span>
                <span className={styles.entryDate}>{item.startDate} - {item.endDate}</span>
              </div>
              <div className={styles.entrySub}>{item.role}</div>
              {item.description && (
                <div className={styles.entryDesc}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.description}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 专业技能 */}
      {data.skills.length > 0 && data.skills.some((s) => s.name.trim()) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}><span className={styles.sectionIcon}>⚡</span>专业技能</h2>
          <ul className={styles.skillsList}>
            {data.skills.filter((s) => s.name.trim()).map((item) => (
              <li key={item.id} className={styles.skillItem}>{item.name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
