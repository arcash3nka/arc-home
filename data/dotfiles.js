// ══════════════════════════════════════════════════════════════════════════
//  .dotfiles — то, что видно только после ^H
//
//  Сюда доходит один посетитель из двадцати, и он уже понял, что это
//  терминал, а не картинка про терминал. Здесь можно быть собой: маты,
//  шутки, самоирония — всё уместно, на обычных страницах этого нет.
//
//  ПРАВИТЬ ЗДЕСЬ. Три блока ниже — независимые:
//    CONFIG  — псевдо-конфиг, печатается как есть, моноширинным
//    PLAN    — список планов (.plan в духе Кармака)
//    BUGS    — «известные баги» про себя, пары [номер, текст]
//
//  Добавить новый блок: допиши массив здесь и одну секцию в
//  src/blocks/dotfiles.js — там всё выводится в три строки.
// ══════════════════════════════════════════════════════════════════════════

export const CONFIG = `// ~/.config/arc/ui.conf
UIConfig cfg;

cfg.colorDirectory        = 1;
cfg.colorFile             = 2;
cfg.colorSelected         = 3;
cfg.colorBorders          = 6;

cfg.colorPictureTP        = 8;
cfg.colorGreenLeathe      = 9;    // @ %
cfg.colorLightGreenLeathe = 10;   // # &
cfg.colorBrownTube        = 11;   // \\ | /

cfg.isHidden              = true; // ← ты здесь
cfg.showInfoPanel         = true;
cfg.widthFM               = 75;`;

export const PLAN = {
	en: [
		'Rewrite the file manager with a proper architecture instead of the one it grew into.',
		'Learn to design a structure from a blank page. Currently I can only recognise a good one.',
		'Ship something someone else depends on. Coursework does not count.',
		'Stop starting the fourth project before the third one is finished.',
	],
	ru: [
		'Переписать файловый менеджер с нормальной архитектурой вместо той, в которую он вырос.',
		'Научиться проектировать структуру с чистого листа. Пока умею только узнавать хорошую.',
		'Сделать то, от чего зависит кто-то кроме меня. Курсовая не считается.',
		'Перестать начинать четвёртый проект, пока не закончен третий.',
	],
};

export const BUGS = {
	en: [
		['#1', 'Reads documentation only after breaking something. Won\'t fix — it works.'],
		['#2', 'Believes a task is 90% done for roughly 60% of its total duration.'],
		['#3', 'Cannot leave a working thing alone. Refactors it. Breaks it. Fixes it. Learns something.'],
		['#4', 'Says "one moment" and returns four hours later with a rewritten module.'],
	],
	ru: [
		['#1', 'Читает документацию только после того, как что-то сломает. Не чиню — работает.'],
		['#2', 'Считает задачу выполненной на 90% примерно 60% всего времени.'],
		['#3', 'Не может оставить работающее в покое. Рефакторит. Ломает. Чинит. Что-то понимает.'],
		['#4', 'Говорит «секунду» и возвращается через четыре часа с переписанным модулем.'],
	],
};

/** Подписи самой страницы .dotfiles. */
export const DOT_UI = {
	lead: {
		en: 'You pressed Ctrl+H. Most people never do. Have the unedited version.',
		ru: 'Вы нажали Ctrl+H. Большинство не нажимает. Держите неотредактированную версию.',
	},
	outro: {
		en: 'None of this is on the front page, and that is deliberate. But if we end up working together you would have found out in a week anyway.',
		ru: 'кто прочитал тот гей',
	},
};
