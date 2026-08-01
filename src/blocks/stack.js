// ══════════════════════════════════════════════════════════════════════════
//  10_stack — карточки технологий
//
//  Одна карточка = один элемент в data/stack.js = одна гроздь на бонсае.
// ══════════════════════════════════════════════════════════════════════════

import { h } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { state } from '../core/state.js';
import { stack } from '../../data/stack.js';
import { ui } from '../../data/ui.js';
import { section, card, levelRow, note, grid } from './parts.js';

export function stackBlock() {
	const wrap = h('div', { class: 'blk blk-stack' },
		section({ en: 'stack', ru: 'стек' }, {
			en: 'Levels are self-assessed on a five-point scale and deliberately conservative. Hover a card — the tree remembers which leaves are its own.',
			ru: 'Уровни — самооценка по пятибалльной шкале, намеренно скромная. Наведите на карточку — дерево помнит, какие листья её.',
		}),
	);

	for (const group of stack) {
		wrap.appendChild(h('h3', { class: 'grp', id: 'card-' + group.id },
			h('span', { class: 'grp-n', text: t(group.name) }),
			h('span', { class: 'grp-c', text: String(group.items.length) }),
		));

		wrap.appendChild(grid(
			group.items.map((item) => card({
				tag: 's:' + item.id,
				accent: item.accent,
				glyph: group.planned ? '·' : '▸',
				name: item.name,
				meta: item.since,
				badge: group.planned ? ui.labels.planned : null,
				body: [
					levelRow(item.level, 5, ui.levelWords[state.lang][item.level]),
					note(item.note),
				],
			})),
		));
	}

	return wrap;
}
