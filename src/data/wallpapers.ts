import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export const SEASON_ORDER: Season[] = ['winter', 'spring', 'summer', 'autumn'];

export interface WallpaperManifest {
  winter: string[];
  spring: string[];
  summer: string[];
  autumn: string[];
  default: string;
}

/**
 * Сканирует /public/assets/wallpapers на этапе сборки и группирует
 * файлы по сезонам: {season}_{index}.jpg. Так скрипт на клиенте
 * «знает» доступные изображения без серверной листинг-директории.
 */
export function buildWallpaperManifest(): WallpaperManifest {
  const dir = fileURLToPath(new URL('../../public/assets/wallpapers', import.meta.url));
  const manifest: WallpaperManifest = {
    winter: [],
    spring: [],
    summer: [],
    autumn: [],
    default: '/assets/wallpapers/default.jpg',
  };

  if (!existsSync(dir)) return manifest;

  const files = readdirSync(dir).filter((f) => /\.(jpe?g|webp|png)$/i.test(f));

  for (const season of SEASON_ORDER) {
    const seasonFiles = files
      .filter((f) => f.startsWith(`${season}_`))
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    manifest[season] = seasonFiles.map((f) => `/assets/wallpapers/${f}`);
  }

  if (files.includes('default.jpg')) {
    manifest.default = '/assets/wallpapers/default.jpg';
  }

  return manifest;
}
