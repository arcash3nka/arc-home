// ══════════════════════════════════════════════════════════════════════════
//  00_whoami
// ══════════════════════════════════════════════════════════════════════════

import { h } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { state } from '../core/state.js';
import { profile } from '../../data/profile.js';
import { createAvatar } from '../ascii/avatarView.js';
import { section, rule } from './parts.js';

export function about() {
	const av = createAvatar();
	requestAnimationFrame(() => av.start());   // сфера горит, пока блок на экране

	const paragraphs = profile.about[state.lang] ?? profile.about.en;

	return h('div', { class: 'blk blk-about' },
		section({ en: 'whoami', ru: 'кто это' }, profile.tagline),

		h('div', { class: 'about-top' },
			h('figure', { class: 'about-portrait' },
				av.el,
				h('figcaption', { class: 'about-sig' },
					h('b', { text: profile.handle }),
					h('span', { text: t(profile.title) }),
				),
			),

			h('div', { class: 'about-text' },
				paragraphs.map((p) => h('p', { text: p })),
				rule(),
				h('dl', { class: 'facts' },
					profile.facts.flatMap((f) => [
						h('dt', { text: t(f.key) }),
						h('dd', { text: t(f.val) }),
					]),
				),

				h('div', { class: 'about-meta' },
					[profile.location, profile.university, profile.program, profile.year]
						.map((v) => h('span', { text: t(v) })),
				),

				h('p', { class: 'note', text: t(profile.resume.note) }),
			),
		),
	);
}
