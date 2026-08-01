// ══════════════════════════════════════════════════════════════════════════
//  00_whoami
// ══════════════════════════════════════════════════════════════════════════

import { h } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { state } from '../core/state.js';
import { profile } from '../../data/profile.js';
import { portrait } from '../../data/portrait.js';
import { createAvatar } from '../ascii/avatarView.js';
import { createPortrait } from '../ascii/portraitView.js';
import { section, rule } from './parts.js';

export function about() {
	// Есть готовый портрет из data/portrait.js — показываем его как есть.
	// Нет — работает процедурный аватар. Переключение автоматическое,
	// поэтому импорт картинки ничего здесь ломать не должен.
	const av = portrait ? createPortrait(portrait) : createAvatar();
	requestAnimationFrame(() => av.start());   // пламя живёт, пока блок на экране

	const paragraphs = profile.about[state.lang] ?? profile.about.en;

	return h('div', { class: 'blk blk-about' },
		section({ en: 'whoami', ru: 'кто это' }, profile.tagline),

		// текст слева, портрет справа: правый рельс с бонсаем на этой
		// странице выключен (data/tree.js), место отдано аватару
		h('div', { class: 'about-top' },
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

			h('figure', { class: 'about-portrait' },
				av.el,
				h('figcaption', { class: 'about-sig' },
					h('b', { text: profile.handle }),
					h('span', { text: t(profile.title) }),
				),
			),
		),
	);
}
