// ══════════════════════════════════════════════════════════════════════════
//  РОУТЕР — путь живёт в адресной строке: #/20_projects/arc-fm
//  Работают «назад» браузера и обычная ссылка на конкретную карточку.
// ══════════════════════════════════════════════════════════════════════════

import { state, set, emit } from './state.js';
import { nodeById } from '../../data/tree.js';

export function parse() {
	const raw = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
	const [dir, focus] = raw.split('/').filter(Boolean);
	return { dir: dir && nodeById(dir) ? dir : null, focus: focus || null };
}

export function go(dir, focus = null, { replace = false } = {}) {
	const hash = dir ? `#/${dir}${focus ? '/' + focus : ''}` : '#/';
	if (location.hash === hash) { apply(); return; }
	if (replace) history.replaceState(null, '', hash);
	else location.hash = hash;
}

export function apply() {
	const { dir, focus } = parse();
	set({ dir, focus });
	emit('route', { dir, focus });
}

export function start() {
	window.addEventListener('hashchange', apply);
	apply();
}

export const atRoot = () => state.dir == null;
