// ══════════════════════════════════════════════════════════════════════════
//  СТЕК — карточки технологий
//
//  Каждый элемент = одна карточка на странице И одна гроздь листьев на
//  бонсае. Добавил объект — дерево выросло. Ничего больше править не надо.
//
//  level: 0..5   0 — не трогал, 1 — читал, 2 — писал учебное,
//                3 — уверенно решаю задачи, 4 — знаю подводные камни,
//                5 — могу объяснить и научить
//
//  Ставь честно. Единственное, что здесь по-настоящему ценно, — что
//  цифрам можно верить.
// ══════════════════════════════════════════════════════════════════════════

export const stack = [
	{
		id: 'languages',
		name: { en: 'languages', ru: 'языки' },
		items: [
			{
				id: 'cpp',
				name: 'C++',
				level: 3,
				since: { en: '1 year · main', ru: '1 год · основной' },
				accent: 'blue',
				note: {
					en: 'Everything I have built seriously is written in it. Comfortable with classes, STL containers, references, file I/O, splitting a program across a dozen translation units. Templates and move semantics I use, but would not yet claim to have mastered.',
					ru: 'Всё, что сделано всерьёз, написано на нём. Уверенно: классы, контейнеры STL, ссылки, файловый ввод-вывод, разнесение программы по десятку модулей. Шаблоны и move-семантику применяю, но пока не назову это владением.',
				},
			},
			{
				id: 'python',
				name: 'Python',
				level: 2,
				since: { en: 'rusty', ru: 'подзабыт' },
				accent: 'yellow',
				note: {
					en: 'My first language — a full game shipped on it. I have not written Python in a while and I can feel it: the syntax comes back in an evening, the libraries take longer. Listed at what it is worth today, not at its peak.',
					ru: 'Первый язык — на нём собрана целая игра. Давно не писал, и это чувствуется: синтаксис возвращается за вечер, библиотеки дольше. Оценка по сегодняшнему дню, а не по лучшей форме.',
				},
			},
		],
	},

	{
		id: 'systems',
		name: { en: 'systems', ru: 'системное' },
		items: [
			{
				id: 'ncurses',
				name: 'ncurses / TUI',
				level: 3,
				since: { en: 'file manager', ru: 'файловый менеджер' },
				accent: 'green',
				note: {
					en: 'Windows, colour pairs, keyboard input, redraw without flicker. I know why a terminal interface stutters and how to stop it. The page you are on is built from the same ideas.',
					ru: 'Окна, цветовые пары, ввод с клавиатуры, перерисовка без мерцания. Знаю, почему терминальный интерфейс дёргается и как это лечится. Страница, на которой вы находитесь, собрана из тех же идей.',
				},
			},
			{
				id: 'binary',
				name: { en: 'binary formats', ru: 'бинарные форматы' },
				level: 3,
				since: { en: 'WAV · bit-level I/O', ru: 'WAV · побитовый ввод-вывод' },
				accent: 'teal',
				note: {
					en: 'Reading a file as bytes rather than as text: headers, offsets, endianness, bit masks. Wrote a WAV analyser and a byte inspector from the specification, not from a tutorial.',
					ru: 'Чтение файла как байтов, а не как текста: заголовки, смещения, порядок байт, битовые маски. Анализатор WAV и просмотрщик байтов написаны по спецификации, а не по туториалу.',
				},
			},
			{
				id: 'linux',
				name: { en: 'Linux / CLI', ru: 'Linux / командная строка' },
				level: 2,
				since: { en: 'daily driver', ru: 'ежедневно' },
				accent: 'mauve',
				note: {
					en: 'Confident in a shell, comfortable with the filesystem, compiling by hand. Not yet strong on systemd, containers or serious sysadmin work.',
					ru: 'Уверенно в оболочке, спокойно с файловой системой, компиляция руками. Пока слабо: systemd, контейнеры, серьёзное администрирование.',
				},
			},
		],
	},

	{
		id: 'craft',
		name: { en: 'engineering', ru: 'инженерия' },
		items: [
			{
				id: 'git',
				name: 'Git',
				level: 2,
				since: { en: 'solo work', ru: 'соло' },
				accent: 'peach',
				note: {
					en: 'Branches, history, remotes — enough to work alone without losing anything. Team workflow with reviews and conflict resolution is the next thing I need real practice in.',
					ru: 'Ветки, история, удалённые репозитории — достаточно, чтобы работать одному и ничего не потерять. Командный процесс с ревью и разрешением конфликтов — следующее, где нужна настоящая практика.',
				},
			},
			{
				id: 'algorithms',
				name: { en: 'algorithms', ru: 'алгоритмы' },
				level: 2,
				since: { en: 'coursework', ru: 'курс' },
				accent: 'sky',
				note: {
					en: 'Standard structures, sorting, complexity estimates. I can reason about why a solution is slow. Competitive-level problem solving is not there yet.',
					ru: 'Базовые структуры, сортировки, оценка сложности. Могу объяснить, почему решение медленное. До олимпиадного уровня далеко.',
				},
			},
			{
				id: 'architecture',
				name: { en: 'architecture', ru: 'архитектура' },
				level: 1,
				since: { en: 'weak spot', ru: 'слабое место' },
				accent: 'red',
				note: {
					en: 'The honest gap. Designing a structure from a blank page is still hard for me. Reading someone else\'s solution is not: show me a well-built project and I will understand the shape of it quickly and reuse it correctly. This is the thing I am deliberately closing.',
					ru: 'Честный пробел. Спроектировать структуру с чистого листа мне пока тяжело. Разобрать чужое — нет: покажите хорошо собранный проект, и я быстро пойму его форму и повторю правильно. Именно это закрываю целенаправленно.',
				},
			},
		],
	},

	// ── Заглушки. Заполнишь, когда дойдут руки — карточки и листья
	//    появятся сами. ──────────────────────────────────────────────────
	{
		id: 'next',
		name: { en: 'in progress', ru: 'в работе' },
		planned: true,
		items: [
			{
				id: 'cmake',
				name: 'CMake',
				level: 1,
				since: { en: 'learning', ru: 'изучаю' },
				accent: 'overlay',
				note: {
					en: 'TODO(arc): replace this text once you have built something non-trivial with it.',
					ru: 'TODO(arc): заменить текст, когда соберёшь этим что-то нетривиальное.',
				},
			},
			{
				id: 'qt',
				name: 'Qt',
				level: 0,
				since: { en: 'planned', ru: 'в планах' },
				accent: 'overlay',
				note: {
					en: 'TODO(arc): the natural next step after ncurses — same program, real window.',
					ru: 'TODO(arc): естественный следующий шаг после ncurses — та же программа, но в настоящем окне.',
				},
			},
			{
				id: 'sql',
				name: 'SQL',
				level: 0,
				since: { en: 'planned', ru: 'в планах' },
				accent: 'overlay',
				note: {
					en: 'TODO(arc): required by the degree programme, useful everywhere else.',
					ru: 'TODO(arc): требуется по направлению и пригодится везде.',
				},
			},
		],
	},
];

/** Плоский список — им кормится бонсай и поиск. */
export const allSkills = stack.flatMap((g) =>
	g.items.map((it) => ({ ...it, group: g.id, planned: !!g.planned })));
