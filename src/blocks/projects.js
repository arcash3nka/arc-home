// ══════════════════════════════════════════════════════════════════════════
//  20_projects
// ══════════════════════════════════════════════════════════════════════════

import { h } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { projects } from '../../data/projects.js';
import { ui } from '../../data/ui.js';
import { section, card, chip, grid } from './parts.js';

export function projectsBlock() {
	return h('div', { class: 'blk blk-projects' },
		section({ en: 'projects', ru: 'проекты' }, {
			en: 'Five things that exist and run. Click a card to open what is inside it.',
			ru: 'Пять вещей, которые существуют и работают. Клик по карточке — что внутри.',
		}),

		grid(projects.map((p) => card({
			id: p.id,
			tag: 'p:' + p.id,
			accent: p.accent,
			glyph: p.featured ? '◈' : '▸',
			name: p.name,
			meta: `${t(p.kind)} · ${p.year}`,
			badge: p.featured ? ui.labels.featured : null,
			wide: !!p.featured,
			expandable: true,
			open: !!p.featured,
			body: [
				h('p', { class: 'card-sum', text: t(p.summary) }),

				h('div', { class: 'card-more' },
					h('ul', { class: 'points' },
						p.points.map((pt) => h('li', { text: t(pt) })),
					),
					p.note && h('p', { class: 'card-note-em', text: t(p.note) }),
				),

				h('footer', { class: 'card-f' },
					h('div', { class: 'chips' }, p.stack.map((s) => chip(s, p.accent))),
					p.repo
						? h('a', {
							class: 'link', href: p.repo, target: '_blank', rel: 'noopener',
							text: t(ui.labels.openRepo) + ' →',
						})
						: h('span', { class: 'muted', text: t(ui.labels.unpublished) }),
				),
			],
		}))),
	);
}
