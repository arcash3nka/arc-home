// ══════════════════════════════════════════════════════════════════════════
//  БОНСАЙ В DOM — рост, дыхание, подсветка гроздей
//
//  Один экземпляр на всю страницу: элемент физически переезжает между
//  героем и правым рельсом, поэтому дерево не перерисовывается при
//  навигации и не теряет состояние.
// ══════════════════════════════════════════════════════════════════════════

import { growBonsai } from './bonsai.js';
import { seedOfToday } from './rng.js';
import { h, clear } from '../core/dom.js';

const GROW_MS = 1700;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function createBonsai({ tags, w = 64, h: rows = 34 }) {
	const root = h('div', { class: 'bonsai', 'aria-hidden': 'true' });
	let cells = [];
	let spans = [];
	let raf = 0;
	let idleTimer = 0;
	let seed = seedOfToday();

	function build(newSeed, animate = true) {
		cancelAnimationFrame(raf);
		clearTimeout(idleTimer);
		seed = newSeed;

		const tree = growBonsai({ seed, w, h: rows, tags });
		cells = tree.cells;
		root.style.setProperty('--cols', tree.w);
		root.style.setProperty('--rows', tree.h);
		clear(root);

		spans = cells.map((c) => {
			// тёмная и светлая листва различаются символом — ровно как
			// colorGreenLeathe и colorLightGreenLeathe в конфиге менеджера
			const shade = c.type === 'leaf' && (c.ch === '@' || c.ch === '%') ? ' bx-l1' : '';
			const s = h('span', {
				class: `bx bx-${c.type}${shade}`,
				style: { gridColumn: c.x + 1, gridRow: c.y + 1 },
				text: c.ch,
			});
			if (c.tag) s.dataset.tag = c.tag;
			return s;
		});
		root.append(...spans);

		if (animate && !reduced()) {
			root.classList.add('is-growing');
			spans.forEach((s) => s.classList.add('bx-off'));
			const t0 = performance.now();
			const tick = (now) => {
				const p = Math.min(1, (now - t0) / GROW_MS);
				// ease-out: крона раскрывается быстрее, чем тянется ствол
				const upTo = Math.floor((1 - Math.pow(1 - p, 2.2)) * spans.length);
				for (let i = 0; i < upTo; i++) spans[i].classList.remove('bx-off');
				if (p < 1) raf = requestAnimationFrame(tick);
				else { root.classList.remove('is-growing'); breathe(); }
			};
			raf = requestAnimationFrame(tick);
		} else {
			breathe();
		}
	}

	// ── дыхание: изредка несколько листьев меняют символ ─────────────────
	function breathe() {
		if (reduced()) return;
		const leaves = spans.filter((s) => s.classList.contains('bx-leaf'));
		if (!leaves.length) return;
		const pool = ['@', '%', '#', '&', '*'];
		idleTimer = setTimeout(function loop() {
			for (let i = 0; i < 5; i++) {
				const s = leaves[(Math.random() * leaves.length) | 0];
				s.textContent = pool[(Math.random() * pool.length) | 0];
				s.classList.add('bx-wind');
				setTimeout(() => s.classList.remove('bx-wind'), 900);
			}
			idleTimer = setTimeout(loop, 2200 + Math.random() * 2600);
		}, 1200);
	}

	return {
		el: root,
		regrow: (s = seedOfToday(Math.floor(Math.random() * 9999))) => build(s, true),
		mount: (parent) => { if (parent && root.parentNode !== parent) parent.appendChild(root); },
		get seed() { return seed; },

		/** Подсветить гроздь, отвечающую карточке. */
		light(tag) {
			root.classList.toggle('has-lit', !!tag);
			for (const s of spans) s.classList.toggle('is-lit', !!tag && s.dataset.tag === tag);
		},

		init: () => build(seed, true),
	};
}
