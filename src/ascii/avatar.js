// ══════════════════════════════════════════════════════════════════════════
//  АВАТАР — горящий манекен
//
//  Чёрный манекен-бюст, у которого верхняя половина головы охвачена огнём.
//  Огонь — лопастное облако шире головы, срезанное снизу волнистой линией;
//  он живёт и переливается, манекен неподвижен.
//
//  Пропорции не подобраны на глаз: исходная картинка была переведена в
//  ASCII (108×54) и обмерена по строкам, а числа ниже — те же замеры под
//  наш холст 64×36. Отсюда, в частности:
//
//    голова        в квадратных единицах 0.75 — заметно выше, чем шире
//    линия огня    ровно по центру головы: видна нижняя половина
//    воротник      74% ширины головы, смещён вправо относительно неё —
//                  это трёхчетвертной ракурс, а не ошибка центровки
//    облако огня   в 1.4 раза шире головы, по высоте равно ей
//
//  Цвет снят с цветной ASCII-версии оригинала, и он идёт не по кругу, а
//  по жару: белое ядро у основания пламени, кверху оно остывает через
//  кремовый, оранжевый, красный и пурпур в глубокий синий. Отдельно —
//  бирюзовая полоса ровно на линии среза, самая заметная деталь оригинала.
//
//  Две вещи, на которых это легко испортить и которые здесь учтены:
//
//  1. Ячейка символа выше, чем шире (примерно 0.57). Горизонтальные
//     размеры заданы в «строчных» единицах и растянуты на ASPECT, а шум
//     по x вдвое ниже по частоте — отсюда слоистость огня, как в оригинале.
//
//  2. На оригинале манекен чёрный на белом. На тёмной странице чёрный
//     силуэт исчезает, а на светлой исчезает белое ядро огня. Поэтому
//     цвета, которые зависят от фона, приходят из CSS через классы
//     av-body / av-lit / av-core, а не инлайном.
// ══════════════════════════════════════════════════════════════════════════

import { makeNoise } from './rng.js';

/** Шкала жара: от самого горячего к самому холодному. */
const HEAT = [
	'#ffffff', '#ffeec2', '#ffc46b', '#ff8a3c', '#ff4d5e',
	'#e8479f', '#c44fd8', '#8a4fe0', '#4a49dd', '#2a35b4', '#161b6e',
];

/** Полоса на линии среза — холодная, бирюзовая. Белого здесь нет
 *  намеренно: он остаётся привилегией ядра, иначе срез сливается с ним. */
const COOL = ['#d8f7ff', '#7fe4f5', '#35b6e6', '#2a72d0', '#1d3fa8'];

const WHITE = '#ffffff';

const RAMP = ['.', ':', '-', '=', '+', '*', '#', '%', '@'];

const ASPECT = 1.75;
const W = 64;
const H = 36;

const noise = makeNoise(0x5eed);

const CX = W / 2 - 0.5;

// ── манекен ──────────────────────────────────────────────────────────────
const HEAD_X = CX - 3.0;                   // голова смещена влево от корпуса
const HEAD_Y = 17.2;
const HEAD_RY = 9.5;
const HEAD_RX = 12.4;

const BODY_X = CX + 1.8;
const COLLAR_TOP = 26;
const COLLAR_W = 9.5;
const SHOULDER_TOP = 31;

// ── огонь ────────────────────────────────────────────────────────────────
const CUT = HEAD_Y;                        // ровно половина головы
const FRX = 17.8;
const FRY = 8.2;
const FX = CX + 0.6;
const FY = CUT - FRY;

/** 0 — снаружи, 1 — внутри, 0.5 — кромка. */
function silhouette(x, y) {
	const dx = (x - HEAD_X) / HEAD_RX;
	const dy = (y - HEAD_Y) / (HEAD_RY * (y > HEAD_Y ? 1.03 : 0.97));
	const head = Math.pow(Math.abs(dx), 2.25) + Math.pow(Math.abs(dy), 2.1);
	if (head <= 1) return head > 0.74 ? 0.5 : 1;

	const d = Math.abs(x - BODY_X);

	// воротник — плотное кольцо под челюстью, у него своя красная кромка
	if (y >= COLLAR_TOP && y < SHOULDER_TOP) {
		if (d < COLLAR_W) return d > COLLAR_W - 2 || y === COLLAR_TOP ? 0.5 : 1;
	}
	if (y >= SHOULDER_TOP) {
		const w = COLLAR_W + 3.8 + (y - SHOULDER_TOP) * 2.8;
		if (d < w) return d > w - 2.2 || y === SHOULDER_TOP ? 0.5 : 1;
	}
	return 0;
}

const cutLine = (x, t) => CUT
	+ Math.sin(x * 0.36 + t * 1.3) * 0.95
	+ Math.sin(x * 0.19 - t * 0.85) * 0.6;

/**
 * Интенсивность огня. Форму держит лопастное облако, срезанное снизу
 * волнистой линией; у самого среза интенсивность принудительно поднята,
 * поэтому граница огня и головы светится — она и читается как «горит».
 */
function flame(x, y, t) {
	const cut = cutLine(x, t);
	if (y > cut) return 0;

	const dx = (x - FX) / FRX;
	const dy = (y - FY) / FRY;
	const r = Math.hypot(dx, dy);
	if (r > 1.7) return 0;

	// три гармоники по углу дают лопасти разного размера
	const ang = Math.atan2(dy, dx);
	const lobe = 1
		+ 0.21 * Math.sin(ang * 3 + t * 0.7)
		+ 0.13 * Math.sin(ang * 6 - t * 1.1)
		+ 0.08 * Math.sin(ang * 9 + t * 1.7);

	let env = 1 - r / lobe;

	// светящаяся полоса по линии среза, шириной с голову
	const band = Math.max(0, 1 - (cut - y) / 5.2);
	const span = Math.max(0, 1 - Math.abs(x - HEAD_X) / (HEAD_RX * 1.3));
	env = Math.max(env, band * span * 0.98);

	if (env <= 0) return 0;

	// шум центрируем вокруг нуля: иначе низкочастотная составляющая
	// гасит и зажигает всё пламя целиком, и кадры скачут по яркости.
	// По x частота вдвое ниже — огонь получается слоистым, а не пятнистым.
	const n = noise(x * 0.3 / ASPECT + 40, y * 0.52 - t * 1.7) * 0.55
		+ noise(x * 0.17 / ASPECT, y * 0.3 - t * 0.85) * 0.45;

	return Math.min(1.55, env * 2.5) * (0.84 + (n - 0.5) * 0.62);
}

/**
 * @param {number} t время в секундах
 * @returns {{w:number,h:number,cells:Array<{x,y,ch,color,cls}>}}
 */
export function renderAvatar(t = 0) {
	const cells = [];

	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			const s = silhouette(x, y);
			const f = flame(x, y, t);

			// над манекеном порог выше: огонь съедает голову только там,
			// где он действительно плотный
			if (f > (s > 0 ? 0.55 : 0.36)) {
				const v = Math.min(1, (f - 0.36) / 0.95);
				const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(v * RAMP.length))];
				const color = flameColor(x, y, f, t);
				// белое ядро на светлой теме слилось бы с фоном, поэтому его
				// цвет, как и заливку манекена, назначает тема
				const core = color === WHITE;
				cells.push({
					x, y, ch,
					color: core ? null : color,
					cls: core ? 'av-flame av-core' : 'av-flame',
				});
				continue;
			}

			if (!s) continue;

			// Выше линии среза манекена нет: там либо огонь, либо пустота.
			// Иначе голова вылезает из пламени сбоку там, где облако тоньше,
			// и вместо «горит» читается «стоит за костром».
			if (y < cutLine(x, t)) continue;

			if (s > 0.9) {
				// Манекен глянцевый: по левой скуле идёт узкий блик, иначе
				// чёрная заливка читается плоским пятном. Цвет ставит тема.
				const gx = (x - HEAD_X) / HEAD_RX;
				const sheen = y < COLLAR_TOP && gx > -0.74 && gx < -0.36;
				cells.push({ x, y, ch: '#', color: null, cls: sheen ? 'av-body av-lit' : 'av-body' });
				continue;
			}

			// Кромка — единственное, чем читается чёрный силуэт на тёмном
			// фоне. Воротник ловит красный, голова — холодный отсвет огня.
			let color;
			if (y >= COLLAR_TOP && y < SHOULDER_TOP) color = HEAT[4];
			else if (y >= SHOULDER_TOP) color = HEAT[8];
			else {
				const up = (HEAD_Y + HEAD_RY - y) / (HEAD_RY * 2);
				color = COOL[up > 0.7 ? 1 : up > 0.5 ? 2 : up > 0.28 ? 3 : 4];
			}
			cells.push({ x, y, ch: '#', color, cls: 'av-rim' });
		}
	}

	return { w: W, h: H, cells };
}

// Ядро жара — компактное пятно чуть выше среза и левее центра облака,
// ровно там, где оно на оригинале. Цвет считается от расстояния до него,
// а не от яркости символа: иначе «горячим» оказывается всё облако разом
// и вся палитра схлопывается в один янтарный.
const HOT_X = FX - 1.8;
const HOT_Y = CUT - FRY * 0.5;
const HOT_RX = FRX * 0.55;
const HOT_RY = FRY * 0.55;

/**
 * От ядра наружу: белое → кремовое → оранжевое → красное → пурпурное →
 * синее. Отдельно, поверх всего, — бирюзовая полоса на линии среза.
 */
function flameColor(x, y, f, t) {
	const cut = cutLine(x, t);

	// на самом срезе — бирюзовая полоса, самая заметная деталь оригинала
	const bandT = (cut - y) / 4.2;
	if (bandT >= 0 && bandT < 1 && Math.abs(x - HEAD_X) < HEAD_RX * 1.15) {
		return COOL[Math.min(COOL.length - 1, Math.floor(bandT * COOL.length))];
	}

	const d = Math.hypot((x - HOT_X) / HOT_RX, (y - HOT_Y) / HOT_RY);
	// яркие ячейки чуть горячее соседних — так шум попадает и в цвет
	const heat = (1.06 - d * 0.6) * (0.78 + 0.42 * Math.min(1, f / 1.35));

	const i = Math.round((1 - heat) * (HEAT.length - 1));
	return HEAT[Math.max(0, Math.min(HEAT.length - 1, i))];
}

export function avatarToText(frame) {
	const grid = Array.from({ length: frame.h }, () => new Array(frame.w).fill(' '));
	for (const c of frame.cells) grid[c.y][c.x] = c.ch;
	return grid.map((r) => r.join('').replace(/\s+$/, '')).join('\n');
}
