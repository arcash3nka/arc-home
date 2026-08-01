// ══════════════════════════════════════════════════════════════════════════
//  АВАТАР В DOM
//
//  Сетка спанов переиспользуется между кадрами: на каждом шаге меняются
//  только те ячейки, где символ или цвет действительно другие. Иначе
//  1500 записей в DOM по двенадцать раз в секунду съедают телефон.
// ══════════════════════════════════════════════════════════════════════════

import { renderAvatar } from './avatar.js';
import { h } from '../core/dom.js';

const FPS = 12;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createAvatar() {
	const root = h('div', {
		class: 'avatar',
		role: 'img',
		'aria-label': 'ASCII portrait',
	});

	const first = renderAvatar(0);
	root.style.setProperty('--cols', first.w);
	root.style.setProperty('--rows', first.h);

	const grid = new Map();   // "x,y" → span
	let timer = 0;
	let t0 = 0;

	function draw(frame) {
		const seen = new Set();
		for (const c of frame.cells) {
			const k = c.x + ',' + c.y;
			seen.add(k);
			let s = grid.get(k);
			if (!s) {
				s = h('span', { style: { gridColumn: c.x + 1, gridRow: c.y + 1 } });
				grid.set(k, s);
				root.appendChild(s);
			}
			if (s.textContent !== c.ch) s.textContent = c.ch;
			if (s.className !== c.cls) s.className = c.cls;
			// заливка силуэта приходит без цвета: её задаёт тема через класс
			const color = c.color ?? '';
			if (s.style.color !== color) s.style.color = color;
			if (s.hidden) s.hidden = false;
		}
		for (const [k, s] of grid) if (!seen.has(k)) s.hidden = true;
	}

	draw(first);

	function start() {
		if (reduced() || timer) return;
		t0 = performance.now();
		timer = setInterval(() => {
			if (document.hidden || !root.isConnected) return;
			draw(renderAvatar((performance.now() - t0) / 1000));
		}, 1000 / FPS);
	}

	function stop() { clearInterval(timer); timer = 0; }

	return { el: root, start, stop };
}
