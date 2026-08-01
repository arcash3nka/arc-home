// ══════════════════════════════════════════════════════════════════════════
//  30_education — вертикальная линия времени
// ══════════════════════════════════════════════════════════════════════════

import { h } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { education } from '../../data/education.js';
import { ui } from '../../data/ui.js';
import { section } from './parts.js';

export function educationBlock() {
	return h('div', { class: 'blk blk-edu' },
		section({ en: 'education', ru: 'образование' }, {
			en: 'Short list — I have not been at this long enough for it to be a long one.',
			ru: 'Список короткий — я занимаюсь этим недостаточно долго, чтобы он был длинным.',
		}),

		h('ol', { class: 'tl' },
			education.map((e) => h('li', { class: 'tl-i', 'data-accent': e.accent, id: 'card-' + e.id },
				h('span', { class: 'tl-dot', 'aria-hidden': 'true', text: '●' }),
				h('div', { class: 'tl-when', text: `${e.from} — ${e.to ?? t(ui.labels.present)}` }),
				h('div', { class: 'tl-what' },
					h('b', { text: t(e.place) }),
					h('span', { text: t(e.what) }),
					h('p', { class: 'note', text: t(e.note) }),
				),
			)),
		),
	);
}
