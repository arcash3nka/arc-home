// ══════════════════════════════════════════════════════════════════════════
//  ПРОЕКТЫ
//
//  repo: null → карточка честно пишет «ещё не опубликовано» вместо
//  битой ссылки. Опубликуешь — просто вставь URL.
//
//  featured: true → проект попадает на главную.
// ══════════════════════════════════════════════════════════════════════════

export const projects = [
	{
		id: 'arc-fm',
		name: 'arc-fm',
		featured: true,
		year: '2025',
		kind: { en: 'coursework · C++', ru: 'курсовая · C++' },
		stack: ['C++', 'ncurses', 'POSIX'],
		accent: 'green',
		summary: {
			en: 'A terminal file manager, written from scratch. Two panels, colour themes, an info panel, hidden-file toggle, file operations — about ten translation units, all of them mine.',
			ru: 'Терминальный файловый менеджер, написанный с нуля. Две панели, цветовые темы, информационная панель, показ скрытых файлов, операции над файлами — около десяти модулей кода, все свои.',
		},
		points: [
			{
				en: 'Configuration lives in a single struct, so themes and layout are data, not scattered constants.',
				ru: 'Конфигурация лежит в одной структуре — темы и раскладка стали данными, а не разбросанными константами.',
			},
			{
				en: 'The command set is open-ended: adding an operation means adding a handler, not editing the render loop.',
				ru: 'Набор команд расширяемый: добавить операцию — значит добавить обработчик, а не править цикл отрисовки.',
			},
			{
				en: 'Draws a bonsai in the info panel, coloured per character. That tree is the reason this website looks the way it does.',
				ru: 'Рисует в информационной панели бонсай, раскрашенный посимвольно. Именно из-за этого дерева сайт выглядит так, как выглядит.',
			},
		],
		note: {
			en: 'You are currently inside a browser port of it.',
			ru: 'Прямо сейчас вы находитесь внутри его браузерного порта.',
		},
		repo: null, // TODO(arc): вставить ссылку после публикации
	},

	{
		id: 'dark-light',
		name: 'Dark Light of the Maze',
		featured: true,
		year: '2024',
		kind: { en: 'capstone · Python', ru: 'выпускная работа · Python' },
		stack: ['Python'],
		accent: 'mauve',
		summary: {
			en: 'Graduation project for the Algorithmika school: a maze game with several levels, enemies and an actual story.',
			ru: 'Выпускная работа школы «Алгоритмика»: игра-лабиринт с несколькими уровнями, врагами и настоящим сюжетом.',
		},
		points: [
			{
				en: 'Level progression, enemy behaviour and a narrative that holds across the whole game.',
				ru: 'Прохождение по уровням, поведение врагов и сюжет, который держится через всю игру.',
			},
			{
				en: 'Written before AI assistants were part of anyone\'s workflow — every line was typed and debugged by hand.',
				ru: 'Написана до того, как ИИ-ассистенты стали частью работы, — каждая строка набрана и отлажена руками.',
			},
			{
				en: 'The visuals are weak and I know it. The logic underneath is not.',
				ru: 'Внешне сделана плохо, и я это знаю. Логика под ней — нет.',
			},
		],
		repo: null,
	},

	{
		id: 'bitview',
		name: 'bitview',
		year: '2025',
		kind: { en: 'lab · C++', ru: 'лабораторная · C++' },
		stack: ['C++'],
		accent: 'sky',
		summary: {
			en: 'Opens any file and reports what it actually contains at the byte and bit level: size, layout, distribution.',
			ru: 'Открывает любой файл и показывает, что в нём на самом деле лежит на уровне байтов и битов: размер, раскладка, распределение.',
		},
		points: [
			{
				en: 'Taught me that a file has no type — only an interpretation.',
				ru: 'Из-за неё стало понятно, что у файла нет типа — есть только интерпретация.',
			},
		],
		repo: null,
	},

	{
		id: 'filecrypt',
		name: 'filecrypt',
		year: '2025',
		kind: { en: 'lab · C++', ru: 'лабораторная · C++' },
		stack: ['C++'],
		accent: 'peach',
		summary: {
			en: 'File encryptor: reads a file as a byte stream, transforms it, writes it back so that it restores exactly.',
			ru: 'Шифратор файлов: читает файл как поток байтов, преобразует и записывает обратно так, чтобы восстанавливалось точь-в-точь.',
		},
		points: [
			{
				en: 'Educational cipher, not a security tool — and it says so instead of pretending otherwise.',
				ru: 'Учебный шифр, а не средство защиты, — и об этом сказано прямо, без вида серьёзной криптографии.',
			},
		],
		repo: null,
	},

	{
		id: 'wavescope',
		name: 'wavescope',
		year: '2025',
		kind: { en: 'lab · C++', ru: 'лабораторная · C++' },
		stack: ['C++', 'DSP'],
		accent: 'pink',
		summary: {
			en: 'Frequency analyser for WAV files — parses the header, reads the samples, shows the spectrum as an equaliser.',
			ru: 'Частотный анализатор WAV — разбирает заголовок, читает сэмплы, показывает спектр в виде эквалайзера.',
		},
		points: [
			{
				en: 'The header is parsed against the specification: chunk sizes, sample rate, bit depth, channel layout.',
				ru: 'Заголовок разбирается по спецификации: размеры чанков, частота дискретизации, битность, раскладка каналов.',
			},
			{
				en: 'Favourite of the labs — the first time a number I computed turned into something I could hear.',
				ru: 'Любимая из лабораторных — впервые посчитанное число превратилось в то, что можно услышать.',
			},
		],
		repo: null,
	},
];
