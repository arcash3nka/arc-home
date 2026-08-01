// ══════════════════════════════════════════════════════════════════════════
//  БОНСАЙ — процедурный генератор
//
//  Дерево не нарисовано руками: оно вырастает рекурсивным ветвлением из
//  одного семени. Каждая гроздь листьев получает тег (id технологии или
//  проекта) — благодаря этому карточка на странице умеет подсветить
//  «свой» кусок кроны. Добавил технологию в data/stack.js — на дереве
//  стало на гроздь больше. Контент и картинка — одно и то же.
//
//  Порядок роста сохраняется в cell.step: анимация просто проигрывает
//  ячейки в этом порядке.
//
//  Символы совпадают с палитрой из моего файлового менеджера:
//    @ %       — тёмная листва      #  &  *  — светлая листва
//    | / \ ~   — ствол и ветки      _  .  :  — горшок и земля
// ══════════════════════════════════════════════════════════════════════════

import { mulberry32 } from './rng.js';

const LEAF_DENSE = ['@', '%', '#', '&'];
const LEAF_EDGE = ['&', '#', '*', '%'];

const POT = [
	'\\_____./|~;~|\\._____/',
	' \\                 / ',
	'  \\_______________/  ',
	'    -           -    ',
];

export function growBonsai(opts = {}) {
	const w = opts.w ?? 64;
	const h = opts.h ?? 34;
	const tags = opts.tags?.length ? opts.tags : [null];
	const rnd = mulberry32(opts.seed ?? 1);

	const map = new Map();
	let step = 0;
	let tagCursor = 0;
	let floorY = h;                       // ниже кромки горшка ветки не растут
	const lean = rnd() < 0.5 ? -1 : 1;    // характерный наклон бонсая

	function put(x, y, ch, type, tag) {
		x = Math.round(x); y = Math.round(y);
		if (x < 0 || x >= w || y < 0 || y >= h) return;
		const k = x + ',' + y;
		const prev = map.get(k);
		// ствол никогда не затирается кроной — иначе дерево «разваливается»
		if (prev && prev.type === 'wood' && type === 'leaf') return;
		if (prev && prev.type === 'pot') return;
		map.set(k, { x, y, ch, type, tag: tag ?? prev?.tag ?? null, step: step++ });
	}

	const nextTag = () => tags[tagCursor++ % tags.length];

	// ── гроздь листьев: эллипс с рваным краем ────────────────────────────
	function leaves(cx, cy, size, tag) {
		tag = tag ?? nextTag();
		const rx = size + 1;
		const ry = Math.max(1, Math.round(size * 0.72));
		for (let dy = -ry; dy <= ry; dy++) {
			for (let dx = -rx; dx <= rx; dx++) {
				const d = (dx * dx) / (rx * rx + 0.5) + (dy * dy) / (ry * ry + 0.4);
				if (d > 1.05) continue;
				if (rnd() < 0.06 + d * d * 0.55) continue;
				const dense = d < 0.5;
				const pool = dense ? LEAF_DENSE : LEAF_EDGE;
				put(cx + dx, cy + dy, pool[Math.floor(rnd() * pool.length)], 'leaf', tag);
			}
		}
	}

	// ── ветка ────────────────────────────────────────────────────────────
	function branch(x, y, type, life, depth) {
		const maxLife = life;
		let side = rnd() < 0.5 ? -1 : 1;
		let flat = 0;

		while (life-- > 0) {
			const age = maxLife - life;
			let dx = 0, dy = 0;

			if (type === 'trunk') {
				if (age <= 2) {
					dy = age === 0 ? 0 : -1;
					dx = age === 0 ? (rnd() < 0.5 ? -1 : 1) : 0;
				} else {
					dy = rnd() < 0.86 ? -1 : 0;
					dx = rnd() < 0.42 ? 0 : (rnd() < 0.42 ? -lean : lean);
				}

				// толщина: у основания ствол в три символа, к вершине — в один.
				// боковые грани рисуются '/' и '\' — ствол зрительно расширяется вниз
				const t = life / maxLife;
				const thick = t > 0.66 ? 2 : t > 0.34 ? 1 : 0;
				for (let i = -thick; i <= thick; i++) {
					if (i === 0) continue;
					const edge = Math.abs(i) === thick;
					put(x + i, y, edge ? (i < 0 ? '/' : '\\') : '|', 'wood');
				}

				// побеги отходят регулярно, поочерёдно в разные стороны
				if (age >= 4 && age % 3 === 0 && life > 3) {
					const len = 6 + Math.floor(rnd() * 7) + Math.floor(life * 0.35);
					branch(x + side * (thick + 1), y, side < 0 ? 'left' : 'right', len, depth + 1);
					side = -side;
					if (rnd() < 0.35) {
						branch(x - side * (thick + 1), y, side > 0 ? 'left' : 'right',
							Math.floor(len * 0.7), depth + 1);
					}
				}
			} else {
				const s = type === 'left' ? -1 : 1;
				const r = rnd();
				dy = r < 0.42 ? -1 : r < 0.84 ? 0 : 1;
				// три горизонтальных шага подряд превращают ветку в провод
				if (dy === 0 && flat >= 2) dy = -1;
				flat = dy === 0 ? flat + 1 : 0;
				dx = s * (rnd() < 0.24 ? 2 : 1);

				if (depth < 3 && life > 5 && rnd() < 0.28) {
					branch(x, y, rnd() < 0.3 ? (s < 0 ? 'right' : 'left') : type,
						Math.floor(life * 0.55) + 2, depth + 1);
				}
				// листва не только на концах — иначе крона выглядит голой
				if (life < maxLife * 0.55 && rnd() < 0.3) {
					leaves(x, y - 1, 1 + Math.floor(rnd() * 2));
				}
			}

			x += dx;
			y += dy;
			if (y < 2) y = 2;
			if (y > floorY) { y = floorY; }
			put(x, y, woodChar(dx, dy), 'wood');
		}

		leaves(x, y - (type === 'trunk' ? 1 : 0),
			type === 'trunk' ? 4 : 2 + Math.floor(rnd() * 2));
	}

	function woodChar(dx, dy) {
		if (dy === 0) return dx === 0 ? '|' : '~';
		if (dx === 0) return '|';
		if (dx < 0) return dy < 0 ? '\\' : '/';
		return dy < 0 ? '/' : '\\';
	}

	// ── горшок ───────────────────────────────────────────────────────────
	const cx = Math.floor(w / 2);
	const potTop = h - POT.length;
	POT.forEach((row, i) => {
		const off = cx - Math.floor(row.length / 2);
		for (let j = 0; j < row.length; j++) {
			if (row[j] !== ' ') put(off + j, potTop + i, row[j], 'pot');
		}
	});

	floorY = potTop - 2;
	branch(cx, potTop - 1, 'trunk', Math.floor(h * 0.66), 0);

	// мох у основания — чтобы ствол не «висел» над горшком
	for (let j = -5; j <= 5; j++) {
		if (rnd() < 0.4) put(cx + j, potTop - 1, rnd() < 0.5 ? '&' : '%', 'leaf', null);
	}

	const cells = [...map.values()].sort((a, b) => a.step - b.step);
	return { w, h, cells, tags: [...new Set(cells.map((c) => c.tag).filter(Boolean))] };
}

/** Отладочный дамп: им же проверяется, что дерево выросло красивым. */
export function toText(tree) {
	const grid = Array.from({ length: tree.h }, () => new Array(tree.w).fill(' '));
	for (const c of tree.cells) grid[c.y][c.x] = c.ch;
	return grid.map((r) => r.join('').replace(/\s+$/, '')).join('\n');
}
