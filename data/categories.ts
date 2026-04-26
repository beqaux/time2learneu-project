import type { Category } from '../lib/types';

export const CATEGORIES: Category[] = [
  {
    id: 'eu-history',
    name: 'AB Tarihi',
    description: 'Avrupa Birliği\'nin kuruluş süreci ve tarihsel gelişimi',
    icon: '🏛️',
  },
  {
    id: 'institutions',
    name: 'AB Kurumları',
    description: 'Avrupa Parlamentosu, Konsey, Komisyon ve diğer kurumlar',
    icon: '🏢',
  },
  {
    id: 'treaties',
    name: 'Antlaşmalar',
    description: 'Roma\'dan Lizbon\'a AB\'yi şekillendiren temel antlaşmalar',
    icon: '📜',
  },
  {
    id: 'culture-symbols',
    name: 'Kültür & Semboller',
    description: 'AB\'nin bayrağı, marşı, değerleri ve kültürel kimliği',
    icon: '🌍',
  },
  {
    id: 'geography-members',
    name: 'Coğrafya & Üye Ülkeler',
    description: 'AB\'nin üye ülkeleri, genişleme süreci ve coğrafi yapısı',
    icon: '🗺️',
  },
];
