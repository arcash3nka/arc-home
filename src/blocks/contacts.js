// ══════════════════════════════════════════════════════════════════════════
//  90_contacts
// ══════════════════════════════════════════════════════════════════════════

import { h } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { contacts } from '../../data/education.js';
import { ui } from '../../data/ui.js';
import { section } from './parts.js';

export function contactsBlock() {
	return h('div', { class: 'blk blk-contacts' },
		section({ en: 'contacts', ru: 'контакты' }, {
			en: 'Freelance work, a question about the code, or an interview — all three are welcome. Click a value to copy it.',
			ru: 'Заказ, вопрос по коду или собеседование — всё уместно. Клик по значению копирует его.',
		}),

		h('div', { class: 'cts' },
			contacts.map((c) => h('div', { class: 'ct', 'data-accent': c.accent, id: 'card-' + c.id },
				h('span', { class: 'ct-l', text: c.label }),
				h('button', {
					class: 'ct-v',
					type: 'button',
					title: t(ui.labels.copy),
					text: c.value,
					onClick: (e) => copy(c.value, e.currentTarget),
				}),
				h('a', {
					class: 'ct-a', href: c.href, target: '_blank', rel: 'noopener',
					text: '→',
					'aria-label': c.label,
				}),
				h('span', { class: 'ct-h', text: t(c.hint) }),
			)),
		),

		h('p', { class: 'note', text: t({
			en: 'I answer within a day. If something in the code above looked wrong to you — say so, that is the most useful message I can get.',
			ru: 'Отвечаю в течение суток. Если что-то в коде выше показалось вам неправильным — напишите об этом: это самое полезное сообщение, которое я могу получить.',
		}) }),
	);
}

async function copy(value, btn) {
	try {
		await navigator.clipboard.writeText(value);
		btn.classList.add('is-copied');
		btn.dataset.copied = t(ui.labels.copied);
		setTimeout(() => btn.classList.remove('is-copied'), 1400);
	} catch {
		// буфер недоступен (нет https или отказ) — выделяем, чтобы скопировали руками
		const r = document.createRange();
		r.selectNodeContents(btn);
		getSelection().removeAllRanges();
		getSelection().addRange(r);
	}
}
