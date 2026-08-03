import {
  themeFromSourceColor,
  argbFromHex,
  hexFromArgb,
  QuantizerCelebi,
  Score,
} from '@material/material-color-utilities';

export type ThemeChoice = 'system' | 'light' | 'dark';

const THEME_KEY = 'theme-preference';

function mediaDark(): MediaQueryList {
  return window.matchMedia('(prefers-color-scheme: dark)');
}

function resolveTheme(choice: ThemeChoice): 'light' | 'dark' {
  if (choice === 'system') return mediaDark().matches ? 'dark' : 'light';
  return choice;
}

export function getStoredTheme(): ThemeChoice {
  const v = localStorage.getItem(THEME_KEY);
  if (v === 'light' || v === 'dark' || v === 'system') return v;
  return 'system';
}

function applyTheme(theme: 'light' | 'dark'): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

/** Мгновенная установка темы до рендера (инлайн-скрипт в <head>). */
export function bootstrapTheme(): void {
  applyTheme(resolveTheme(getStoredTheme()));
}

export function setTheme(choice: ThemeChoice): void {
  localStorage.setItem(THEME_KEY, choice);
  applyTheme(resolveTheme(choice));
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: { choice } }));
}

export function cycleTheme(): ThemeChoice {
  const order: ThemeChoice[] = ['system', 'light', 'dark'];
  const cur = getStoredTheme();
  const next = order[(order.indexOf(cur) + 1) % order.length];
  setTheme(next);
  return next;
}

export function initThemeToggle(): void {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const updateIcon = (): void => {
    const cur = getStoredTheme();
    const icon = btn.querySelector('md-icon');
    if (!icon) return;
    icon.textContent = cur === 'light' ? 'light_mode' : cur === 'dark' ? 'dark_mode' : 'brightness_auto';
    btn.setAttribute('aria-label', `Тема: ${cur} — нажмите для смены`);
  };

  btn.addEventListener('click', () => {
    cycleTheme();
    updateIcon();
  });

  mediaDark().addEventListener('change', () => {
    applyTheme(resolveTheme(getStoredTheme()));
    updateIcon();
  });

  updateIcon();
}

/* ==========================================================================
   Динамический акцентный цвет: извлекаем палитру из текущих обоев
   ========================================================================== */

const PROP_MAP: Record<string, string> = {
  primary: 'primary', onPrimary: 'on-primary', primaryContainer: 'primary-container', onPrimaryContainer: 'on-primary-container',
  secondary: 'secondary', onSecondary: 'on-secondary', secondaryContainer: 'secondary-container', onSecondaryContainer: 'on-secondary-container',
  tertiary: 'tertiary', onTertiary: 'on-tertiary', tertiaryContainer: 'tertiary-container', onTertiaryContainer: 'on-tertiary-container',
  error: 'error', onError: 'on-error', errorContainer: 'error-container', onErrorContainer: 'on-error-container',
  background: 'background', onBackground: 'on-background',
  surface: 'surface', onSurface: 'on-surface', surfaceVariant: 'surface-variant', onSurfaceVariant: 'on-surface-variant',
  outline: 'outline', outlineVariant: 'outline-variant',
  shadow: 'shadow', scrim: 'scrim',
  inverseSurface: 'inverse-surface', inverseOnSurface: 'inverse-on-surface', inversePrimary: 'inverse-primary',
  surfaceTint: 'surface-tint',
};

function propOf(scheme: Record<string, unknown>, key: string): number {
  const v = (scheme as Record<string, number>)[key];
  if (typeof v === 'number') return v;
  const props = (scheme as { props?: Record<string, number> }).props;
  return props ? props[key] : 0;
}

function applyTokens(scheme: Record<string, unknown>, isDark: boolean): void {
  const root = document.documentElement;
  const neutral = (scheme as { palettes?: { neutral: { tone: (t: number) => number } } }).palettes?.neutral;

  const set = (name: string, value: string): void => {
    root.style.setProperty(name, value);
  };

  for (const [key, cssName] of Object.entries(PROP_MAP)) {
    set(`--md-sys-color-${cssName}`, hexFromArgb(propOf(scheme, key)));
  }

  if (neutral) {
    const containerTones = isDark
      ? { 'surface-dim': 6, 'surface-bright': 24, 'surface-container-lowest': 4, 'surface-container-low': 10, 'surface-container': 12, 'surface-container-high': 17, 'surface-container-highest': 22 }
      : { 'surface-dim': 87, 'surface-bright': 98, 'surface-container-lowest': 100, 'surface-container-low': 96, 'surface-container': 94, 'surface-container-high': 92, 'surface-container-highest': 90 };
    for (const [name, tone] of Object.entries(containerTones)) {
      set(`--md-sys-color-${name}`, hexFromArgb(neutral.tone(tone)));
    }
  }
}

/**
 * Достаёт доминирующий цвет из картинки обоев (маленький canvas 64×64),
 * генерирует из него MD3-тему и применяет к токенам.
 */
export async function extractAccentFromWallpaper(url: string): Promise<void> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = url;

  try {
    await img.decode();
  } catch {
    return;
  }

  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  const pixels: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    pixels.push(argbFromHex(rgbToHex(data[i], data[i + 1], data[i + 2])));
  }

  const result = QuantizerCelebi.quantize(pixels, 128);
  const ranked = Score.score(result);

  if (!ranked.length) return;
  const seed = ranked[0];
  const theme = themeFromSourceColor(seed);

  const isDark = resolveTheme(getStoredTheme()) === 'dark';
  applyTokens(theme.schemes[isDark ? 'dark' : 'light'] as unknown as Record<string, unknown>, isDark);
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function initDynamicColor(): void {
  window.addEventListener('wallpaper-loaded', (e) => {
    const { url } = (e as CustomEvent<{ url: string }>).detail;
    void extractAccentFromWallpaper(url);
  });
}
