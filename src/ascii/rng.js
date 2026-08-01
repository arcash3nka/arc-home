// ══════════════════════════════════════════════════════════════════════════
//  RNG — детерминированный генератор. Один и тот же seed даёт одно и то же
//  дерево: сайт выглядит одинаково при перезагрузке в течение дня, но каждый
//  день вырастает новое.
// ══════════════════════════════════════════════════════════════════════════

export function mulberry32(seed) {
	let a = seed >>> 0;
	return function () {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Сид от календарного дня — дерево меняется раз в сутки. */
export function seedOfToday(salt = 0) {
	const d = new Date();
	return (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + salt) >>> 0;
}

/** Простой value-noise на решётке — для пламени аватара. */
export function makeNoise(seed) {
	const rnd = mulberry32(seed);
	const size = 256;
	const table = new Float32Array(size * size);
	for (let i = 0; i < table.length; i++) table[i] = rnd();

	const at = (x, y) => table[(((y % size) + size) % size) * size + (((x % size) + size) % size)];
	const smooth = (t) => t * t * (3 - 2 * t);

	return function noise(x, y) {
		const x0 = Math.floor(x), y0 = Math.floor(y);
		const fx = smooth(x - x0), fy = smooth(y - y0);
		const a = at(x0, y0), b = at(x0 + 1, y0);
		const c = at(x0, y0 + 1), d = at(x0 + 1, y0 + 1);
		return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
	};
}
