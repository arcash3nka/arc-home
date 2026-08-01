// ══════════════════════════════════════════════════════════════════════════
//  СОСТОЯНИЕ — одна разделяемая структура и шина событий
//
//  Настройки (язык, тема, CRT) переживают перезагрузку. Позиция в дереве
//  живёт в адресной строке, а не здесь, — чтобы ссылкой можно было
//  поделиться.
// ══════════════════════════════════════════════════════════════════════════

const KEY = 'arc.prefs.v1';
const bus = new EventTarget();

export const state = {
	lang: 'en',
	theme: 'mocha',
	crt: false,
	hidden: false,      // показывать ли .dotfiles
	dir: null,          // текущий каталог, null = корень
	focus: null,        // подсвеченная карточка внутри каталога
	cursor: 0,          // позиция курсора в левой панели
	filter: '',
	overlay: null,      // 'help' | 'shell' | null
	booted: false,
};

(function restore() {
	try {
		const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
		for (const k of ['lang', 'theme', 'crt', 'hidden']) {
			if (k in saved) state[k] = saved[k];
		}
	} catch { /* приватный режим или битый json — просто дефолты */ }

	// первый заход: угадываем язык по браузеру, дальше решает пользователь
	try {
		if (!localStorage.getItem(KEY) && navigator.language?.startsWith('ru')) {
			state.lang = 'ru';
		}
	} catch { /* ignore */ }
})();

function persist() {
	try {
		localStorage.setItem(KEY, JSON.stringify({
			lang: state.lang, theme: state.theme, crt: state.crt, hidden: state.hidden,
		}));
	} catch { /* ignore */ }
}

export function set(patch) {
	let changed = false;
	for (const [k, v] of Object.entries(patch)) {
		if (state[k] !== v) { state[k] = v; changed = true; }
	}
	if (!changed) return;
	persist();
	emit('change', patch);
}

export const on = (type, fn) => bus.addEventListener(type, fn);
export const emit = (type, detail) => bus.dispatchEvent(new CustomEvent(type, { detail }));
