// ══════════════════════════════════════════════════════════════════════════
//  ПОРТРЕТ В DOM — готовый цветной ASCII вместо процедурного аватара
//
//  Картинка вставляется ровно такой, какой её отдал конвертер: ни один
//  символ и ни один цвет не пересчитываются. Живым её делает только
//  мерцание — насыщенные (огненные) ячейки медленно ходят по яркости
//  бегущей волной. Фон и манекен не трогаются вообще.
//
//  Оттенки для мерцания считаются один раз при сборке: на каждый огненный
//  цвет — девять готовых строк. В кадре остаётся только присвоить строку
//  тем ячейкам, у которых ступень действительно сменилась, поэтому даже
//  на пяти тысячах символов это почти ничего не стоит.
// ══════════════════════════════════════════════════════════════════════════

import { h } from '../core/dom.js';

const FPS = 10;
const STEPS = 9;                       // ступеней яркости на цвет
const AMPLITUDE = 0.16;                // ±16% — заметно, но картинка не «дышит грудью»

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Осветлить/затемнить #rrggbb на коэффициент k около единицы. */
function shade(hex, k) {
	const v = parseInt(hex.slice(1), 16);
	const ch = (s) => {
		const c = Math.round(((v >> s) & 255) * k);
		return Math.max(0, Math.min(255, c));
	};
	return '#' + [ch(16), ch(8), ch(0)].map((c) => c.toString(16).padStart(2, '0')).join('');
}

export function createPortrait(data) {
	const root = h('div', {
		class: 'avatar portrait',
		role: 'img',
		'aria-label': 'ASCII portrait',
	});
	root.style.setProperty('--cols', data.w);
	root.style.setProperty('--rows', data.h);

	// ── палитра оттенков ─────────────────────────────────────────────────
	const vivid = new Set(data.vivid);
	const shades = data.palette.map((hex, i) => {
		if (!vivid.has(i)) return null;
		return Array.from({ length: STEPS }, (_, s) =>
			shade(hex, 1 + AMPLITUDE * ((s / (STEPS - 1)) * 2 - 1)));
	});

	// ── раскладываем RLE в сетку ─────────────────────────────────────────
	const live = [];                    // только мерцающие ячейки
	const frag = document.createDocumentFragment();
	let i = 0;

	for (const [count, ch, ci] of data.runs) {
		for (let n = 0; n < count; n++, i++) {
			const x = i % data.w;
			const y = (i / data.w) | 0;
			if (ch === ' ') continue;

			const span = h('span', {
				style: { gridColumn: x + 1, gridRow: y + 1, color: data.palette[ci] },
				text: ch,
			});
			frag.appendChild(span);

			if (shades[ci]) live.push({ span, shades: shades[ci], x, y, step: -1 });
		}
	}
	root.appendChild(frag);

	// ── мерцание ─────────────────────────────────────────────────────────
	let timer = 0;
	let t0 = 0;

	function frame() {
		if (document.hidden || !root.isConnected) return;
		const t = (performance.now() - t0) / 1000;
		for (const c of live) {
			const wave = Math.sin(c.y * 0.34 - t * 2.0 + c.x * 0.05);
			const step = Math.round((wave + 1) / 2 * (STEPS - 1));
			if (step === c.step) continue;
			c.step = step;
			c.span.style.color = c.shades[step];
		}
	}

	return {
		el: root,
		start() {
			if (reduced() || timer) return;
			t0 = performance.now();
			timer = setInterval(frame, 1000 / FPS);
		},
		stop() { clearInterval(timer); timer = 0; },
	};
}
