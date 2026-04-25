interface CompanyMeta {
  label: string;
  color: string;
  textColor: string;
  logo?: string;
}

const companyMap: Record<string, CompanyMeta> = {
  字节跳动: { label: '字', color: '#3b5cff', textColor: '#fff', logo: '/logos/bytedance.png' },
  字节: { label: '字', color: '#3b5cff', textColor: '#fff', logo: '/logos/bytedance.png' },
  bytedance: { label: 'B', color: '#3b5cff', textColor: '#fff', logo: '/logos/bytedance.png' },
  华为: { label: '华', color: '#cf0a2c', textColor: '#fff', logo: '/logos/huawei.png' },
  huawei: { label: 'H', color: '#cf0a2c', textColor: '#fff', logo: '/logos/huawei.png' },
  腾讯: { label: '腾', color: '#07c160', textColor: '#fff' },
  tencent: { label: 'T', color: '#07c160', textColor: '#fff' },
  阿里巴巴: { label: '阿', color: '#ff6a00', textColor: '#fff' },
  阿里: { label: '阿', color: '#ff6a00', textColor: '#fff' },
  alibaba: { label: 'A', color: '#ff6a00', textColor: '#fff' },
  百度: { label: '百', color: '#2932e1', textColor: '#fff' },
  baidu: { label: 'B', color: '#2932e1', textColor: '#fff' },
  京东: { label: '京', color: '#e1251b', textColor: '#fff' },
  jd: { label: 'J', color: '#e1251b', textColor: '#fff' },
  美团: { label: '美', color: '#ffc300', textColor: '#333' },
  meituan: { label: 'M', color: '#ffc300', textColor: '#333' },
  小米: { label: '米', color: '#ff6900', textColor: '#fff' },
  xiaomi: { label: 'X', color: '#ff6900', textColor: '#fff' },
  网易: { label: '网', color: '#c03731', textColor: '#fff' },
  netease: { label: 'N', color: '#c03731', textColor: '#fff' },
};

export function matchCompany(name: string): CompanyMeta | null {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  for (const [k, v] of Object.entries(companyMap)) {
    if (key === k.toLowerCase() || key.includes(k.toLowerCase())) {
      return v;
    }
  }
  return null;
}

export function getCompanyInitial(name: string): { char: string; color: string; textColor: string; logo?: string } | null {
  if (!name) return null;
  const meta = matchCompany(name);
  if (meta) return { char: meta.label, color: meta.color, textColor: meta.textColor, logo: meta.logo };
  const first = name.trim()[0];
  if (!first) return null;
  return { char: first, color: '#666', textColor: '#fff' };
}
