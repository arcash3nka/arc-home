// ══════════════════════════════════════════════════════════════════════════
//  ДЕРЕВО КАТАЛОГОВ — оно же карта сайта
//
//  Левая панель читает этот массив. Чтобы появился новый раздел, нужно:
//    1. добавить сюда объект,
//    2. написать рендерер в src/blocks/ и зарегистрировать его.
//  Вёрстку трогать не нужно ни при каком раскладе.
// ══════════════════════════════════════════════════════════════════════════

import { stack, allSkills } from './stack.js';
import { projects } from './projects.js';
import { education, contacts } from './education.js';

export const tree = [
	{
		id: '00_whoami',
		block: 'about',
		glyph: '◆',
		accent: 'blue',
		desc: { en: 'who is typing', ru: 'кто это печатает' },
	},
	{
		id: '10_stack',
		block: 'stack',
		glyph: '◈',
		accent: 'green',
		desc: { en: 'what I can actually do', ru: 'что я действительно умею' },
	},
	{
		id: '20_projects',
		block: 'projects',
		glyph: '◇',
		accent: 'mauve',
		desc: { en: 'what I have built', ru: 'что уже построено' },
	},
	{
		id: '30_education',
		block: 'education',
		glyph: '◉',
		accent: 'peach',
		desc: { en: 'where it came from', ru: 'откуда это взялось' },
	},
	{
		id: '40_activity',
		block: 'activity',
		glyph: '▨',
		accent: 'sky',
		desc: { en: 'live from GitHub', ru: 'живьём с GitHub' },
	},
	{
		id: '90_contacts',
		block: 'contacts',
		glyph: '✉',
		accent: 'teal',
		desc: { en: 'how to reach me', ru: 'как со мной связаться' },
	},
	{
		id: '.dotfiles',
		block: 'dotfiles',
		glyph: '·',
		accent: 'overlay',
		hidden: true,
		desc: { en: 'you found it', ru: 'нашёл' },
	},
];

/** Дети раздела для навигации. Возвращает [{ id, name, tag }]. */
export function childrenOf(id) {
	switch (id) {
		case '10_stack':
			return stack.map((g) => ({ id: g.id, name: g.name, tag: null }));
		case '20_projects':
			return projects.map((p) => ({ id: p.id, name: p.name, tag: 'p:' + p.id }));
		case '30_education':
			return education.map((e) => ({ id: e.id, name: e.place, tag: null }));
		case '90_contacts':
			return contacts.map((c) => ({ id: c.id, name: c.label, tag: null }));
		default:
			return [];
	}
}

export const nodeById = (id) => tree.find((n) => n.id === id);

/** Теги для листвы бонсая: каждый навык и каждый проект — своя гроздь. */
export const leafTags = [
	...allSkills.map((s) => 's:' + s.id),
	...projects.map((p) => 'p:' + p.id),
];
