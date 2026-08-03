import type { Season, WallpaperManifest } from '../data/wallpapers';

declare global {
  interface Window {
    __wallpaperManifest?: WallpaperManifest;
  }
}

const SEASON_BY_MONTH: Season[][] = [
  ['winter'], ['winter'], ['spring'], ['spring'], ['spring'],
  ['summer'], ['summer'], ['summer'], ['autumn'], ['autumn'], ['autumn'], ['winter'],
];

const MONTH_NAMES: Record<Season, string> = {
  winter: 'зима',
  spring: 'весна',
  summer: 'лето',
  autumn: 'осень',
};

export function getSeason(date: Date = new Date()): Season {
  return SEASON_BY_MONTH[date.getMonth()][0];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Не удалось загрузить: ${src}`));
    img.src = src;
  });
}

/**
 * Выбирает случайное доступное изображение сезона.
 * Проверяет загрузку каждого кандидата; при неудаче — fallback на default.jpg.
 * Также сообщает выбраный URL (для извлечения акцентного цвета).
 */
export async function pickWallpaper(
  manifest: WallpaperManifest,
  season: Season = getSeason(),
): Promise<{ url: string; season: Season; isFallback: boolean }> {
  const candidates = [...(manifest[season] ?? [])];
  const shuffled = candidates.sort(() => Math.random() - 0.5);

  for (const url of shuffled) {
    try {
      await loadImage(url);
      return { url, season, isFallback: false };
    } catch {
      /* пробуем следующее */
    }
  }

  const fallback = manifest.default ?? '/assets/wallpapers/default.jpg';
  try {
    await loadImage(fallback);
  } catch {
    /* даже дефолта нет — останется background-color */
  }
  return { url: fallback, season, isFallback: true };
}

export function applyWallpaper(url: string): void {
  const layer = document.querySelector<HTMLElement>('.bg-layer');
  if (!layer) return;
  layer.style.backgroundImage = `url("${url}")`;
}

export function initBackground(): void {
  let manifest = window.__wallpaperManifest;

  if (!manifest) {
    const el = document.getElementById('wallpaper-manifest');
    if (el) {
      try {
        manifest = JSON.parse(el.dataset.manifest || '') as WallpaperManifest;
      } catch {
        manifest = undefined;
      }
    }
  }

  if (!manifest) return;

  pickWallpaper(manifest)
    .then(({ url, season, isFallback }) => {
      applyWallpaper(url);
      document.documentElement.dataset.season = season;
      if (isFallback) {
        console.warn(`[bg] Обои для сезона «${MONTH_NAMES[season]}» не найдены — используется default.jpg.`);
      }
      window.dispatchEvent(new CustomEvent('wallpaper-loaded', { detail: { url, season } }));
    })
    .catch(() => {
      /* фон останется background-color */
    });
}
