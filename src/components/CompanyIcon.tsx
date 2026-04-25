import { getCompanyInitial } from '../utils/companyLogo';
import styles from './CompanyIcon.module.css';

interface CompanyIconProps {
  name: string;
  size?: number;
}

export function CompanyIcon({ name, size = 28 }: CompanyIconProps) {
  const meta = getCompanyInitial(name);
  if (!meta) return null;

  if (meta.logo) {
    return (
      <img
        className={styles.logoImg}
        src={meta.logo}
        alt={name}
        style={{ height: size }}
      />
    );
  }

  return (
    <span
      className={styles.icon}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        backgroundColor: meta.color,
        color: meta.textColor,
      }}
    >
      {meta.char}
    </span>
  );
}
