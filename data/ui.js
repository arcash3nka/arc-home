// ══════════════════════════════════════════════════════════════════════════
//  СТРОКИ ИНТЕРФЕЙСА — всё, что не контент
// ══════════════════════════════════════════════════════════════════════════

export const ui = {
	windowTitle: { en: 'arc-fm — /home/arc', ru: 'arc-fm — /home/arc' },
	skipHint: { en: 'press any key to skip', ru: 'любая клавиша — пропустить' },

	nav: { en: 'index', ru: 'индекс' },
	preview: { en: 'preview', ru: 'превью' },
	dir: { en: 'DIR', ru: 'КАТ' },
	home: { en: 'home', ru: 'домой' },
	homeHint: { en: 'back to the front page', ru: 'на главную' },

	hints: [
		{ key: '↑↓ / jk', label: { en: 'move', ru: 'выбор' } },
		{ key: '↵', label: { en: 'open', ru: 'открыть' } },
		{ key: '⌫', label: { en: 'back', ru: 'назад' } },
		{ key: '^H', label: { en: 'hidden', ru: 'скрытые' } },
		{ key: ':', label: { en: 'shell', ru: 'шелл' } },
		{ key: '?', label: { en: 'help', ru: 'помощь' } },
	],

	root: {
		lead: { en: 'index of', ru: 'индекс' },
		enter: { en: 'pick a directory on the left, or type', ru: 'выберите каталог слева или наберите' },
	},

	labels: {
		level: { en: 'level', ru: 'уровень' },
		unpublished: { en: 'not published yet', ru: 'ещё не опубликовано' },
		openRepo: { en: 'open repository', ru: 'открыть репозиторий' },
		present: { en: 'present', ru: 'сейчас' },
		copy: { en: 'click to copy', ru: 'клик — скопировать' },
		copied: { en: 'copied', ru: 'скопировано' },
		planned: { en: 'planned', ru: 'в планах' },
		featured: { en: 'featured', ru: 'ключевой' },
		loading: { en: 'fetching…', ru: 'загружаю…' },
		offline: {
			en: 'GitHub did not answer. The numbers below are the ones I can prove offline.',
			ru: 'GitHub не ответил. Ниже — только то, что можно подтвердить без сети.',
		},
	},

	levelWords: {
		en: ['untouched', 'read about it', 'wrote coursework', 'solve tasks confidently', 'know the pitfalls', 'can teach it'],
		ru: ['не трогал', 'читал', 'писал учебное', 'уверенно решаю', 'знаю подводные камни', 'могу научить'],
	},

	activity: {
		commits: { en: 'public events', ru: 'публичных событий' },
		repos: { en: 'repositories', ru: 'репозиториев' },
		days: { en: 'active days', ru: 'активных дней' },
		streak: { en: 'streak', ru: 'серия' },
		less: { en: 'less', ru: 'меньше' },
		more: { en: 'more', ru: 'больше' },
		note: {
			en: 'Pulled live from the GitHub API when you opened this page. Public events only — the API shows about three months back.',
			ru: 'Тянется с GitHub API в момент открытия страницы. Только публичные события — API отдаёт примерно три месяца.',
		},
	},

	help: {
		title: { en: 'keys', ru: 'клавиши' },
		rows: [
			['↑ ↓ / j k', { en: 'move the cursor', ru: 'двигать курсор' }],
			['↵ / →', { en: 'open the entry', ru: 'открыть запись' }],
			['⌫ / ←', { en: 'go back up', ru: 'на уровень выше' }],
			['g / G', { en: 'first / last entry', ru: 'первая / последняя запись' }],
			['/', { en: 'filter the index', ru: 'фильтр по индексу' }],
			[':', { en: 'open the shell', ru: 'открыть шелл' }],
			['Ctrl+H', { en: 'toggle hidden entries', ru: 'показать скрытое' }],
			['Ctrl+L', { en: 'switch language', ru: 'сменить язык' }],
			['Ctrl+T', { en: 'switch theme', ru: 'сменить тему' }],
			['?', { en: 'this panel', ru: 'эта панель' }],
			['Esc', { en: 'close anything open', ru: 'закрыть что открыто' }],
		],
		footer: {
			en: 'Everything also works with a mouse. The keyboard is just faster.',
			ru: 'Всё работает и мышью. Клавиатура просто быстрее.',
		},
	},

	shell: {
		placeholder: { en: 'type a command — help lists them', ru: 'команда — help покажет список' },
		unknown: { en: 'command not found:', ru: 'команда не найдена:' },
		noDir: { en: 'no such directory:', ru: 'нет такого каталога:' },
		hint: { en: 'Esc closes, ↑↓ walks history, Tab completes', ru: 'Esc закрывает, ↑↓ история, Tab дополняет' },
	},
};

/** Строки загрузки. Ровно те же баннеры, что в моих исходниках. */
export function bootLines({ seed, skills, projects, lang }) {
	const ok = '[  ok  ]';
	const en = [
		['bar', '═'.repeat(46)],
		['head', ' arc-fm.web — cold start'],
		['bar', '═'.repeat(46)],
		['ok', `${ok} tty ............................ attached`],
		['ok', `${ok} colour pairs allocated ......... 12`],
		['ok', `${ok} mounting /home/arc ............. read-only`],
		['ok', `${ok} germinating bonsai ............. seed ${seed}`],
		['ok', `${ok} index built .................... ${skills} skills · ${projects} projects`],
		['done', '[ done ] handing over control'],
	];
	const ru = [
		['bar', '═'.repeat(46)],
		['head', ' arc-fm.web — холодный старт'],
		['bar', '═'.repeat(46)],
		['ok', `${ok} tty ............................ подключён`],
		['ok', `${ok} цветовые пары .................. 12`],
		['ok', `${ok} монтирование /home/arc ......... только чтение`],
		['ok', `${ok} прорастание бонсая ............. семя ${seed}`],
		['ok', `${ok} индекс собран .................. ${skills} навыков · ${projects} проектов`],
		['done', '[ done ] передаю управление'],
	];
	return lang === 'ru' ? ru : en;
}
