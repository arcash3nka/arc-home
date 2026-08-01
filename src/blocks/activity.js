// ══════════════════════════════════════════════════════════════════════════
//  40_activity — тепловая карта и живые репозитории
//
//  Та же сетка, что у меня в Obsidian: недели по горизонтали, дни недели
//  по вертикали. Данные тянутся при открытии; если GitHub промолчал —
//  блок так и пишет, вместо того чтобы рисовать выдуманную активность.
// ══════════════════════════════════════════════════════════════════════════

import { h, clear } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { state } from '../core/state.js';
import { profile } from '../../data/profile.js';
import { ui } from '../../data/ui.js';
import { fetchGitHub } from '../core/gh.js';
import { section, rule } from './parts.js';

const DAYS = 182;
const COLORS = ['#313244', '#585b70', '#7f849c', '#b4befe', '#cba6f7'];
const MONTHS = {
	en: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
	ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
};

const key = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const level = (n) => (n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 12 ? 3 : 4);

export function activityBlock() {
	const body = h('div', { class: 'act-body' },
		h('p', { class: 'muted', text: t(ui.labels.loading) }),
	);

	const root = h('div', { class: 'blk blk-act' },
		section({ en: 'activity', ru: 'активность' }, ui.activity.note),
		body,
	);

	fetchGitHub(profile.github)
		.then((gh) => { clear(body); body.appendChild(render(gh)); })
		.catch(() => {
			clear(body);
			body.appendChild(h('div', { class: 'warn', text: t(ui.labels.offline) }));
			body.appendChild(h('p', { class: 'note' },
				h('a', {
					class: 'link', href: 'https://github.com/' + profile.github,
					target: '_blank', rel: 'noopener',
					text: 'github.com/' + profile.github + ' →',
				}),
			));
		});

	return root;
}

function render(gh) {
	const today = new Date(); today.setHours(0, 0, 0, 0);
	const start = new Date(today);
	start.setDate(start.getDate() - DAYS);
	start.setDate(start.getDate() - ((start.getDay() + 6) % 7));   // выравнивание на понедельник

	const weeks = [];
	const cursor = new Date(start);
	while (cursor <= today) {
		const week = [];
		for (let i = 0; i < 7; i++) {
			week.push(cursor <= today
				? { date: new Date(cursor), n: gh.counts.get(key(cursor)) ?? 0 }
				: null);
			cursor.setDate(cursor.getDate() + 1);
		}
		weeks.push(week);
	}

	const months = h('div', {
		class: 'heat-m',
		style: { gridTemplateColumns: `repeat(${weeks.length},1fr)` },
	});
	let prev = -1;
	weeks.forEach((w, i) => {
		const first = w.find(Boolean);
		if (!first) return;
		const m = first.date.getMonth();
		if (m !== prev) {
			months.appendChild(h('span', {
				style: { gridColumn: i + 1, gridRow: 1 },
				text: MONTHS[state.lang][m],
			}));
			prev = m;
		}
	});

	const cells = h('div', {
		class: 'heat-g',
		style: { gridTemplateColumns: `repeat(${weeks.length},1fr)` },
	});
	let active = 0;
	weeks.forEach((w, i) => w.forEach((d, j) => {
		if (!d) return;
		if (d.n > 0) active++;
		const label = `${String(d.date.getDate()).padStart(2, '0')}.${String(d.date.getMonth() + 1).padStart(2, '0')} — ${d.n}`;
		cells.appendChild(h('i', {
			style: { gridColumn: i + 1, gridRow: j + 1, background: COLORS[level(d.n)] },
			title: label,
		}));
	}));

	// серия: сколько дней подряд назад от сегодня были события
	let streak = 0;
	const walk = new Date(today);
	while ((gh.counts.get(key(walk)) ?? 0) > 0) { streak++; walk.setDate(walk.getDate() - 1); }

	const stats = h('div', { class: 'stats' },
		stat(gh.events, ui.activity.commits),
		stat(gh.publicRepos, ui.activity.repos),
		stat(active, ui.activity.days),
		stat(streak, ui.activity.streak),
	);

	const langs = gh.languages.length && h('div', { class: 'langs' },
		gh.languages.slice(0, 5).map(([name, n]) => h('div', { class: 'lang' },
			h('span', { class: 'lang-n', text: name }),
			h('span', {
				class: 'lang-b',
				style: { width: `${(n / gh.languages[0][1]) * 100}%` },
			}),
			h('span', { class: 'lang-c', text: String(n) }),
		)),
	);

	const repos = gh.repos.length && h('div', { class: 'repos' },
		gh.repos.map((r) => h('a', {
			class: 'repo', href: r.url, target: '_blank', rel: 'noopener',
		},
			h('span', { class: 'repo-n', text: r.name }),
			h('span', { class: 'repo-d', text: r.desc || '—' }),
			h('span', { class: 'repo-m', text: [r.lang, r.stars ? '★ ' + r.stars : null].filter(Boolean).join(' · ') }),
		)),
	);

	return h('div', null,
		stats,
		!gh.events && h('p', { class: 'note', text: t({
			en: 'No public events in this window — the recent work has not been pushed anywhere public yet.',
			ru: 'В этом окне публичных событий нет — недавняя работа пока никуда публично не выложена.',
		}) }),
		h('div', { class: 'heat' },
			months,
			h('div', { class: 'heat-row' },
				h('div', { class: 'heat-d' },
					h('span', { text: state.lang === 'ru' ? 'Пн' : 'Mon' }),
					h('span', { text: state.lang === 'ru' ? 'Ср' : 'Wed' }),
					h('span', { text: state.lang === 'ru' ? 'Пт' : 'Fri' }),
				),
				cells,
			),
			h('div', { class: 'heat-f' },
				h('span', { class: 'muted', text: `@${gh.user}` }),
				h('span', { class: 'heat-l' },
					h('span', { text: t(ui.activity.less) }),
					COLORS.map((c) => h('i', { style: { background: c } })),
					h('span', { text: t(ui.activity.more) }),
				),
			),
		),
		langs || null,
		repos ? [rule(), repos] : null,
	);
}

function stat(value, label) {
	return h('div', { class: 'stat' },
		h('b', { text: String(value) }),
		h('i', { text: t(label) }),
	);
}
