// ══════════════════════════════════════════════════════════════════════════
//  ДЕТАЛИ — общие кирпичи, из которых собраны все блоки
// ══════════════════════════════════════════════════════════════════════════

import { h, levelBar } from '../core/dom.js';
import { t } from '../core/i18n.js';

export function section(title, sub) {
	return h('header', { class: 'sec' },
		h('h2', { class: 'sec-t', text: t(title) }),
		sub && h('p', { class: 'sec-s', text: t(sub) }),
	);
}

export function chip(text, accent) {
	return h('span', { class: 'chip', 'data-accent': accent || null, text });
}

/**
 * Карточка. tag связывает её с гроздью на бонсае: при наведении
 * соответствующие листья загораются.
 */
export function card({
	tag = null, accent = 'blue', glyph = '▸', name, meta, badge,
	body = [], expandable = false, open = false, wide = false, id = null,
}) {
	const el = h('article', {
		class: 'card' + (wide ? ' card-wide' : '') + (expandable ? ' is-expandable' : ''),
		'data-accent': accent,
		'data-tag': tag,
		id: id ? 'card-' + id : null,
		tabindex: expandable ? '0' : null,
		role: expandable ? 'button' : null,
		'aria-expanded': expandable ? String(open) : null,
	},
		h('header', { class: 'card-h' },
			h('span', { class: 'card-glyph', text: glyph }),
			h('h3', { class: 'card-n', text: t(name) }),
			meta && h('span', { class: 'card-m', text: t(meta) }),
			badge && h('span', { class: 'card-b', text: t(badge) }),
		),
		h('div', { class: 'card-body' }, body),
	);

	if (expandable) {
		el.classList.toggle('is-open', open);
		const toggle = () => {
			const nowOpen = !el.classList.contains('is-open');
			el.classList.toggle('is-open', nowOpen);
			el.setAttribute('aria-expanded', String(nowOpen));
		};
		el.addEventListener('click', (e) => {
			if (e.target.closest('a')) return;    // ссылке не мешаем
			toggle();
		});
		el.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
		});
	}

	return el;
}

/** Полоса уровня: и текстом, и графикой — читается в любом виде. */
export function levelRow(level, max, word) {
	return h('div', { class: 'lvl' },
		h('span', { class: 'lvl-ascii', text: levelBar(level, max) }),
		h('span', { class: 'lvl-n', text: `${level}/${max}` }),
		word && h('span', { class: 'lvl-w', text: t(word) }),
	);
}

export const note = (text) => h('p', { class: 'note', text: t(text) });

export const grid = (...children) => h('div', { class: 'grid' }, children);

export const rule = () => h('div', { class: 'rule', 'aria-hidden': 'true' });
