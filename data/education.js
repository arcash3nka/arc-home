// ══════════════════════════════════════════════════════════════════════════
//  ОБРАЗОВАНИЕ И КОНТАКТЫ
//  TODO(arc): проверь годы в timeline и подставь настоящие контакты.
// ══════════════════════════════════════════════════════════════════════════

export const education = [
	{
		id: 'leti',
		from: '2024',
		to: null,                       // null → «настоящее время»
		accent: 'blue',
		place: { en: 'ETU "LETI", Saint Petersburg', ru: 'СПбГЭТУ «ЛЭТИ», Санкт-Петербург' },
		what: {
			en: '09.03.02 — Information Systems and Technologies, year 2',
			ru: '09.03.02 — Информационные системы и технологии, 2 курс',
		},
		note: {
			en: 'Where the C++ came from, and where the coursework below was built.',
			ru: 'Отсюда C++ и все проекты ниже.',
		},
	},
	{
		id: 'algorithmika',
		from: '2022',
		to: '2024',
		accent: 'mauve',
		place: { en: 'Algorithmika', ru: 'Алгоритмика' },
		what: { en: 'Programming school — graduated', ru: 'Школа программирования — выпустился' },
		note: {
			en: 'Python, and a graduation project that turned out to be a whole game.',
			ru: 'Python и выпускная работа, которая оказалась целой игрой.',
		},
	},
	{
		id: 'self',
		from: '2023',
		to: null,
		accent: 'green',
		place: { en: 'On my own', ru: 'Самостоятельно' },
		what: { en: 'Terminal interfaces, binary formats, tooling', ru: 'Терминальные интерфейсы, бинарные форматы, инструменты' },
		note: {
			en: 'TODO(arc): add courses, olympiads and certificates here as they happen.',
			ru: 'TODO(arc): сюда — курсы, олимпиады и сертификаты по мере появления.',
		},
	},
];

export const contacts = [
	{
		id: 'telegram',
		label: 'Telegram',
		value: '@arcash3nka',            // TODO(arc): проверь ник
		href: 'https://t.me/arcash3nka',
		accent: 'sky',
		hint: { en: 'fastest', ru: 'быстрее всего' },
	},
	{
		id: 'github',
		label: 'GitHub',
		value: 'github.com/arcash3nka',
		href: 'https://github.com/arcash3nka',
		accent: 'mauve',
		hint: { en: 'the code', ru: 'код' },
	},
	{
		id: 'email',
		label: 'Email',
		value: 'mail@example.com',       // TODO(arc): поставить настоящую почту
		href: 'mailto:mail@example.com',
		accent: 'green',
		hint: { en: 'for long things', ru: 'для длинного' },
	},
];
