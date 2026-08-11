export interface NavItem {
  label: string;
  href: string;
  icon: string;
  description: string;
  accent: string;
}

export const SITE = {
  title: 'Семён Хартов',
  tagline: 'Личный сайт-портфолио',
  description:
    'Сайт-портфолио для моих проектов.',
  url: 'https://semyonhartov.github.io',
  author: 'Семён Хартов',
  email: 'semyonhartov@gmail.com',
  telegram: 'https://t.me/semyonhartov',
  github: 'https://github.com/semyonhartov',
} as const;

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Главная',
    href: '/',
    icon: 'home',
    description: 'Обо мне, навигация и контакты',
    accent: 'primary',
  },
  {
    label: 'Проекты',
    href: '/projects',
    icon: 'code_blocks',
    description: 'Что я делаю и делал',
    accent: 'tertiary',
  },
  {
    label: 'Творчество',
    href: '/creativity',
    icon: 'palette',
    description: 'Видео, музыка, медиа',
    accent: 'tertiary',
  },
  {
    label: 'Платформы',
    href: '/links',
    icon: 'link',
    description: 'Где меня найти',
    accent: 'secondary',
  },
  {
    label: 'Энергетики',
    href: '/energy-drinks',
    icon: 'bolt',
    description: 'Рейтинг и обзоры',
    accent: 'primary',
  },
  {
    label: 'Сетап',
    href: '/setup',
    icon: 'computer',
    description: 'Техника и окружение',
    accent: 'secondary',
  },
];
