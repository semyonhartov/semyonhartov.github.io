type Scale = 'litenergy' | 'normal';
type Col = 'brand' | 'name' | 'rating';

interface DrinkRow {
  el: HTMLTableRowElement;
  brand: string;
  name: string;
  rating: number;
}

let scale: Scale = 'litenergy';
let sortCol: Col | null = null;
let sortDir: 1 | -1 = 1;

function formatRating(rating: number, note: string | null): string {
  if (scale === 'litenergy') {
    return String(rating) + (note ? ` ${note}` : '');
  }
  const main = parseFloat((10 - rating).toFixed(2));
  if (note) {
    const invertedNote = note.replace(/(\d+\.?\d*)/g, (m) => {
      const val = parseFloat((10 - parseFloat(m)).toFixed(2));
      return Number.isInteger(val) ? String(val) : String(val);
    });
    return `${main} ${invertedNote}`;
  }
  return String(main);
}

function ratingDirection(): 1 | -1 {
  // Хранимое значение — оценка по Литэнерджи (меньше = лучше).
  // В обеих шкалах «лучшие» идут при возрастающей сортировке,
  // т.к. в «обычной» шкале значение = 10 − rating.
  return 1;
}

function initDrinkPreviews(): void {
  const links = Array.from(document.querySelectorAll<HTMLElement>('.drink-link'));
  if (!links.length) return;

  const popup = document.createElement('div');
  popup.className = 'drink-popup';
  popup.setAttribute('role', 'presentation');
  document.body.appendChild(popup);

  const show = (link: HTMLElement): void => {
    const img = link.querySelector<HTMLImageElement>('.drink-thumb img');
    const placeholder = link.querySelector<HTMLElement>('.drink-thumb .empty-cell');
    if (!img && !placeholder) return;

    popup.innerHTML = '';
    const frame = document.createElement('div');
    frame.className = 'drink-popup-frame';
    if (img) {
      const clone = img.cloneNode(true) as HTMLImageElement;
      clone.removeAttribute('loading');
      frame.appendChild(clone);
    } else if (placeholder) {
      frame.appendChild(placeholder.cloneNode(true));
    }
    popup.appendChild(frame);

    const rect = link.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const POPUP_W = 150;
    const GAP = 10;
    const margin = 12;

    let left = rect.left + rect.width / 2 - POPUP_W / 2;
    left = Math.max(margin, Math.min(left+50, vw - POPUP_W - margin));

    popup.style.left = left + 'px';
    popup.style.top = '-9999px';
    popup.style.opacity = '0';
    const h = popup.offsetHeight;

    let top = rect.top - GAP - h;
    if (top < margin) {
      top = rect.bottom + GAP;
      if (top + h > vh - margin) top = Math.max(margin, vh - h - margin);
    }
    popup.style.top = top + 'px';
    popup.style.opacity = '1';
  };

  const hide = (): void => {
    popup.style.opacity = '0';
  };

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => show(link));
    link.addEventListener('mouseleave', hide);
    link.addEventListener('focus', () => show(link));
    link.addEventListener('blur', hide);
  });
}

export function initDrinksTable(): void {
  const table = document.querySelector<HTMLTableElement>('#ratings-table');
  if (!table) return;

  initDrinkPreviews();

  const tbody = table.tBodies[0];
  if (!tbody) return;

  const rows: DrinkRow[] = Array.from(tbody.rows).map((el) => ({
    el,
    brand: el.dataset.brand ?? '',
    name: el.dataset.name ?? '',
    rating: parseFloat(el.dataset.rating ?? '0'),
  }));

  const render = (): void => {
    rows.forEach((row) => {
      const cell = row.el.querySelector<HTMLElement>('[data-rating-cell]');
      if (!cell) return;
      const note = cell.dataset.note ? cell.dataset.note : null;
      const value = formatRating(row.rating, note);
      cell.textContent = value;
      cell.setAttribute('aria-label', value);
    });
  };

  const sort = (): void => {
    if (!sortCol) return;
    const dir = sortDir;
    rows.sort((a, b) => {
      if (sortCol === 'rating') return (a.rating - b.rating) * dir;
      const av = sortCol === 'brand' ? a.brand : a.name;
      const bv = sortCol === 'brand' ? b.brand : b.name;
      return av.localeCompare(bv, 'ru', { numeric: true, sensitivity: 'base' }) * dir;
    });
    rows.forEach((row) => tbody.appendChild(row.el));
  };

  const headers = Array.from(table.querySelectorAll<HTMLTableElement>('thead th[data-col]'));
  const activate = (th: HTMLTableElement): void => {
    const col = th.dataset.col as Col;
    if (sortCol !== col) {
      sortCol = col;
      sortDir = col === 'rating' ? ratingDirection() : 1;
    } else {
      sortDir = sortDir === 1 ? -1 : 1;
    }
    headers.forEach((h) => h.removeAttribute('aria-sort'));
    th.setAttribute('aria-sort', sortDir === 1 ? 'ascending' : 'descending');
    sort();
  };

  headers.forEach((th) => {
    th.addEventListener('click', () => activate(th));
    th.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(th);
      }
    });
  });

  const toggle = document.getElementById('scale-toggle');
  if (toggle) {
    const label = document.getElementById('scale-label');
    toggle.addEventListener('change', () => {
      scale = (toggle as { selected?: boolean }).selected ? 'normal' : 'litenergy';
      if (label) {
        label.textContent =
          scale === 'litenergy' ? 'Литэнерджи (меньше = лучше)' : 'Обычная (больше = лучше)';
      }
      if (sortCol === 'rating') {
        sortDir = ratingDirection();
        headers.forEach((h) => h.removeAttribute('aria-sort'));
        const th = headers.find((h) => h.dataset.col === 'rating');
        if (th) th.setAttribute('aria-sort', sortDir === 1 ? 'ascending' : 'descending');
        sort();
      }
      render();
    });
  }

  render();
}
