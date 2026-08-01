// ══════════════════════════════════════════════════════════════════════════
//  РЕЕСТР БЛОКОВ
//
//  Единственное место, где движок узнаёт о существовании раздела.
//  Новый блок: файл рядом + строка здесь + объект в data/tree.js.
// ══════════════════════════════════════════════════════════════════════════

import { about } from './about.js';
import { stackBlock } from './stack.js';
import { projectsBlock } from './projects.js';
import { educationBlock } from './education.js';
import { activityBlock } from './activity.js';
import { contactsBlock } from './contacts.js';
import { dotfilesBlock } from './dotfiles.js';

export const blocks = {
	about,
	stack: stackBlock,
	projects: projectsBlock,
	education: educationBlock,
	activity: activityBlock,
	contacts: contactsBlock,
	dotfiles: dotfilesBlock,
};
