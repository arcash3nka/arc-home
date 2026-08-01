// ══════════════════════════════════════════════════════════════════════════
//  .dotfiles — раздел, который открывается по ^H
//
//  Здесь только отрисовка. Весь текст, конфиг и шутки лежат в
//  data/dotfiles.js — править надо там.
// ══════════════════════════════════════════════════════════════════════════

import { h } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { state } from '../core/state.js';
import { CONFIG, PLAN, BUGS, DOT_UI } from '../../data/dotfiles.js';
import { section, rule } from './parts.js';

export function dotfilesBlock() {
	const plan = PLAN[state.lang] ?? PLAN.en;
	const bugs = BUGS[state.lang] ?? BUGS.en;

	return h('div', { class: 'blk blk-dot' },
		section({ en: '.dotfiles', ru: '.dotfiles' }, DOT_UI.lead),

		h('h3', { class: 'grp' }, h('span', { class: 'grp-n', text: 'ui.conf' })),
		h('pre', { class: 'code', text: CONFIG }),

		rule(),

		h('h3', { class: 'grp' }, h('span', { class: 'grp-n', text: '.plan' })),
		h('ul', { class: 'points' }, plan.map((x) => h('li', { text: x }))),

		rule(),

		h('h3', { class: 'grp' },
			h('span', { class: 'grp-n', text: 'KNOWN_BUGS' }),
			h('span', { class: 'grp-c', text: String(bugs.length) }),
		),
		h('ul', { class: 'bugs' },
			bugs.map(([n, x]) => h('li', null,
				h('span', { class: 'bug-n', text: n }),
				h('span', { text: x }),
			)),
		),

		h('p', { class: 'note', text: t(DOT_UI.outro) }),
	);
}
