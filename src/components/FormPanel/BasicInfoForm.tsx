import { useResumeState, useResumeDispatch } from '../../context/ResumeContext';
import styles from './BasicInfoForm.module.css';

export function BasicInfoForm() {
  const { basicInfo } = useResumeState();
  const dispatch = useResumeDispatch();

  const handleChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_BASIC', payload: { [field]: value } });
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>基本信息</h3>
      <label className={styles.label}>
        姓名
        <input
          className={styles.input}
          value={basicInfo.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="张三"
        />
      </label>
      <label className={styles.label}>
        电话
        <input
          className={styles.input}
          value={basicInfo.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="138xxxx xxxx"
        />
      </label>
      <label className={styles.label}>
        邮箱
        <input
          className={styles.input}
          value={basicInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="example@mail.com"
        />
      </label>
      <label className={styles.label}>
        城市
        <input
          className={styles.input}
          value={basicInfo.city}
          onChange={(e) => handleChange('city', e.target.value)}
          placeholder="深圳"
        />
      </label>
      <label className={styles.label}>
        求职意向
        <input
          className={styles.input}
          value={basicInfo.objective}
          onChange={(e) => handleChange('objective', e.target.value)}
          placeholder="前端工程师"
        />
      </label>
    </div>
  );
}
