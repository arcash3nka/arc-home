// ══════════════════════════════════════════════════════════════════════════
//  ПРОФИЛЬ — кто это вообще
//  Все строки двуязычные: { en, ru }. Правится руками, ничего больше.
// ══════════════════════════════════════════════════════════════════════════

export const profile = {
	handle: 'arcash3nka',
	github: 'arcash3nka',

	title: {
		en: 'systems programmer · second-year student',
		ru: 'системный программист · второй курс',
	},

	location: { en: 'Saint Petersburg, RU', ru: 'Санкт-Петербург' },
	university: { en: 'ETU "LETI"', ru: 'СПбГЭТУ «ЛЭТИ»' },
	program: {
		en: '09.03.02 — Information Systems and Technologies',
		ru: '09.03.02 — Информационные системы и технологии',
	},
	year: { en: 'year 2', ru: '2 курс' },

	// Одна строка, которую человек унесёт с собой.
	tagline: {
		en: 'I write software that has no graphics.',
		ru: 'Пишу программы, у которых нет графики.',
	},

	about: {
		en: [
			'Second-year engineering student in Saint Petersburg. I work close to the metal: file managers, binary parsers, encoders, terminal interfaces. Things that run in a black window and do exactly one job without asking.',
			'My rule is simple — if it works and I cannot explain why, it is not finished. That is slower than copying an answer. It is also the reason I can open somebody else\'s codebase and be useful in it by the end of the day.',
			'I am early. One year of C++, a handful of projects, real gaps. They are listed below without decoration: I would rather you see the honest version now than discover it later.',
		],
		ru: [
			'Второй курс, Санкт-Петербург. Работаю близко к железу: файловые менеджеры, разборщики бинарных форматов, шифраторы, терминальные интерфейсы. Программы, которые живут в чёрном окне и делают ровно одно дело, ничего не спрашивая.',
			'Правило простое — если работает, а объяснить почему не могу, значит не доделано. Это медленнее, чем списать готовое. И это же причина, по которой я открываю чужой проект и к вечеру начинаю в нём приносить пользу.',
			'Я в начале пути. Год C++, несколько проектов, реальные пробелы. Они перечислены ниже без украшений: лучше вы увидите честную версию сейчас, чем обнаружите её потом.',
		],
	},

	// Три факта, которые видно сразу под именем.
	facts: [
		{
			key: { en: 'focus', ru: 'фокус' },
			val: { en: 'C++ · systems · TUI', ru: 'C++ · системное · TUI' },
		},
		{
			key: { en: 'status', ru: 'статус' },
			val: { en: 'open to freelance', ru: 'открыт к фрилансу' },
		},
		{
			key: { en: 'response', ru: 'ответ' },
			val: { en: 'within a day', ru: 'в течение суток' },
		},
	],

	// TODO(arc): заменить на настоящее резюме, когда появится
	resume: {
		file: null,
		note: {
			en: 'No PDF yet — this page is the resume. Everything on it is verifiable in the repositories.',
			ru: 'PDF пока нет — резюме это и есть. Всё на странице проверяется по репозиториям.',
		},
	},
};
