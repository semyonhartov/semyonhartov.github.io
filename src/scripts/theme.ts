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
  if (accentSeed !== null) {
    applyAccent(accentSeed);
  }
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

const THEME_SVGS: Record<string, string> = {
  light:
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path transform="matrix(0.022727 0 0 0.022727 1.0909 1.0909)" d="M480.0 360.0Q530 360 565.0 395.0Q600 430 600.0 480.0Q600 530 565.0 565.0Q530 600 480.0 600.0Q430 600 395.0 565.0Q360 530 360.0 480.0Q360 430 395.0 395.0Q430 360 480.0 360.0ZM480.0 280.0Q397 280 338.5 338.5Q280 397 280.0 480.0Q280 563 338.5 621.5Q397 680 480.0 680.0Q563 680 621.5 621.5Q680 563 680.0 480.0Q680 397 621.5 338.5Q563 280 480.0 280.0ZM80 440Q63 440 51.5 451.5Q40 463 40.0 480.0Q40 497 51.5 508.5Q63 520 80 520H160Q177 520 188.5 508.5Q200 497 200.0 480.0Q200 463 188.5 451.5Q177 440 160 440ZM800 440Q783 440 771.5 451.5Q760 463 760.0 480.0Q760 497 771.5 508.5Q783 520 800 520H880Q897 520 908.5 508.5Q920 497 920.0 480.0Q920 463 908.5 451.5Q897 440 880 440ZM440 800V880Q440 897 451.5 908.5Q463 920 480.0 920.0Q497 920 508.5 908.5Q520 897 520 880V800Q520 783 508.5 771.5Q497 760 480.0 760.0Q463 760 451.5 771.5Q440 783 440 800ZM440 80V160Q440 177 451.5 188.5Q463 200 480.0 200.0Q497 200 508.5 188.5Q520 177 520 160V80Q520 63 508.5 51.5Q497 40 480.0 40.0Q463 40 451.5 51.5Q440 63 440 80ZM226 678 183 720Q171 731 171.5 748.0Q172 765 183 777Q195 789 212.0 789.0Q229 789 240 777L282 734Q293 722 293.0 706.0Q293 690 282 678Q271 666 254.5 666.5Q238 667 226 678ZM720 183 678 226Q667 238 667.0 254.5Q667 271 678 282Q689 294 705.5 293.5Q722 293 734 282L777 240Q789 229 788.5 212.0Q788 195 777 183Q765 171 748.0 171.0Q731 171 720 183ZM678 678Q666 689 666.5 705.5Q667 722 678 734L720 777Q731 789 748.0 788.5Q765 788 777 777Q789 765 789.0 748.0Q789 731 777 720L734 678Q722 667 706.0 667.0Q690 667 678 678ZM183 183Q171 195 171.0 212.0Q171 229 183 240L226 282Q238 293 254.5 293.0Q271 293 282 282Q294 271 293.5 254.5Q293 238 282 226L240 183Q229 171 212.0 171.5Q195 172 183 183Z"/></svg>',
  dark:
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path transform="matrix(0.027834 0 0 0.027834 -1.3401 -1.3401)" d="M480 120Q329 120 224.5 224.5Q120 329 120 480Q120 618 210.0 719.5Q300 821 440 838Q453 840 463.0 834.5Q473 829 479 820Q485 811 485.5 799.0Q486 787 478 776Q461 750 452.5 721.0Q444 692 444 660Q444 570 507.0 507.0Q570 444 660 444Q691 444 721.5 453.0Q752 462 776 478Q787 485 798.5 484.5Q810 484 819 479Q829 474 834.5 464.0Q840 454 838 440Q824 302 720.5 211.0Q617 120 480 120ZM480 200Q568 200 638.0 248.5Q708 297 740 375Q720 370 700.0 367.0Q680 364 660 364Q537 364 450.5 450.5Q364 537 364 660Q364 680 367.0 700.0Q370 720 375 740Q297 708 248.5 638.0Q200 568 200 480Q200 364 282.0 282.0Q364 200 480 200Z"/></svg>',
  system:
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path transform="matrix(0.023810 0 0 0.023810 0.5714 0.5714)" d="M408 412H554L579 339Q582 331 589.5 325.5Q597 320 606 320Q621 320 629.5 332.5Q638 345 633 359L519 661Q516 670 508.0 675.0Q500 680 491 680H469Q460 680 452.0 675.0Q444 670 441 661L327 360Q322 346 330.5 333.0Q339 320 355 320Q365 320 372.5 325.5Q380 331 383 340ZM426 464 478 614H482L534 464ZM346 160H240Q207 160 183.5 183.5Q160 207 160 240V346L83 424Q72 436 66.0 450.5Q60 465 60.0 480.0Q60 495 66.0 509.5Q72 524 83 536L160 614V720Q160 753 183.5 776.5Q207 800 240 800H346L424 877Q436 888 450.5 894.0Q465 900 480.0 900.0Q495 900 509.5 894.0Q524 888 536 877L614 800H720Q753 800 776.5 776.5Q800 753 800 720V614L877 536Q888 524 894.0 509.5Q900 495 900.0 480.0Q900 465 894.0 450.5Q888 436 877 424L800 346V240Q800 207 776.5 183.5Q753 160 720 160H614L536 83Q524 72 509.5 66.0Q495 60 480.0 60.0Q465 60 450.5 66.0Q436 72 424 83ZM380 240 480 140L580 240H720V380L820 480L720 580V720H580L480 820L380 720H240V580L140 480L240 380V240ZM480.0 480.0Q480 480 480.0 480.0Z"/></svg>',
};

export function initThemeToggle(): void {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const updateIcon = (): void => {
    const cur = getStoredTheme();
    const icon = btn.querySelector<HTMLElement>('.theme-icon');
    if (icon) icon.innerHTML = THEME_SVGS[cur];
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

let accentSeed: number | null = null;

function applyAccent(seed: number): void {
  const theme = themeFromSourceColor(seed);
  const isDark = resolveTheme(getStoredTheme()) === 'dark';
  applyTokens(theme.schemes[isDark ? 'dark' : 'light'] as unknown as Record<string, unknown>, isDark);
}

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
  accentSeed = ranked[0];
  applyAccent(accentSeed);
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
