// ══════════════════════════════════════════════════════════════════════════
//  ШЕЛЛ — рабочая командная строка
//
//  Не декорация: ls, cd, cat и open реально двигают страницу, а grep
//  ищет по тем же данным, из которых собраны карточки. Вывод — всегда
//  текстом, никакой чужой разметки.
// ══════════════════════════════════════════════════════════════════════════

import { h, clear } from '../core/dom.js';
import { state, set } from './state.js';
import { go } from './router.js';
import { tree, nodeById } from '../../data/tree.js';
import { allSkills, stack } from '../../data/stack.js';
import { projects } from '../../data/projects.js';
import { contacts } from '../../data/education.js';
import { profile } from '../../data/profile.js';
import { growBonsai, toText } from '../ascii/bonsai.js';
import { seedOfToday } from '../ascii/rng.js';

const START = Date.now();

export function createShell({ bonsai, onClose }) {
	const log = h('div', { class: 'sh-log' });
	const prompt = h('span', { class: 'sh-p' });
	const input = h('input', {
		class: 'sh-in', type: 'text', spellcheck: 'false', autocomplete: 'off',
		'aria-label': 'command line',
	});

	const el = h('div', { class: 'sh' },
		h('div', { class: 'sh-head' },
			h('span', { text: 'arc-fm shell' }),
			h('span', { class: 'muted', text: 'Esc · ↑↓ history · Tab complete' }),
		),
		log,
		h('label', { class: 'sh-line' }, prompt, input),
	);

	const history = [];
	let hi = 0;

	function line(text, cls) {
		log.appendChild(h('div', { class: 'sh-l' + (cls ? ' sh-' + cls : ''), text }));
		log.scrollTop = log.scrollHeight;
	}
	const lines = (arr, cls) => arr.forEach((x) => line(x, cls));

	function updatePrompt() {
		prompt.textContent = `arc@web:/home/arc${state.dir ? '/' + state.dir : ''}$`;
	}

	// ── команды ──────────────────────────────────────────────────────────
	const commands = {
		help: {
			desc: 'this list',
			run: () => {
				line('available commands', 'ok');
				for (const [name, c] of Object.entries(commands)) {
					line(`  ${name.padEnd(10)} ${c.desc}`);
				}
				line('');
				line('  tip: everything here also works with the keyboard alone. press ? for keys.', 'dim');
			},
		},

		ls: {
			desc: 'list the current directory',
			run: (arg) => {
				const dir = arg || state.dir;
				if (!dir) {
					for (const n of tree) {
						if (n.hidden && !state.hidden) continue;
						line(`drwxr-xr-x  ${n.id.padEnd(14)} ${n.desc.en}`);
					}
					if (!state.hidden) line('  (1 entry hidden — ctrl+h)', 'dim');
					return;
				}
				const node = nodeById(dir);
				if (!node) return line(`ls: ${dir}: no such directory`, 'err');
				for (const c of listing(dir)) line(`-rw-r--r--  ${c}`);
			},
		},

		cd: {
			desc: 'enter a directory (.. or / to go up)',
			run: (arg) => {
				if (!arg || arg === '/' || arg === '~' || arg === '..') { go(null); return; }
				const node = nodeById(arg);
				if (!node) return line(`cd: ${arg}: no such directory`, 'err');
				if (node.hidden) set({ hidden: true });
				go(arg);
				line(`→ /home/arc/${arg}`, 'ok');
			},
		},

		cat: {
			desc: 'print a section as plain text',
			run: (arg) => {
				if (!arg) return line('cat: which one? try: cat 00_whoami', 'err');
				if (arg === '00_whoami' || arg === 'about') {
					lines(profile.about.en);
					return;
				}
				const skill = allSkills.find((s) => s.id === arg);
				if (skill) {
					line(`${nameOf(skill.name)} — level ${skill.level}/5`, 'ok');
					return line(skill.note.en);
				}
				const p = projects.find((x) => x.id === arg);
				if (p) {
					line(`${p.name} · ${p.kind.en} · ${p.year}`, 'ok');
					line(p.summary.en);
					p.points.forEach((pt) => line('  - ' + pt.en));
					return line(p.repo ? p.repo : '  (repository not published yet)', 'dim');
				}
				line(`cat: ${arg}: no such file`, 'err');
			},
		},

		open: {
			desc: 'jump straight to a project card',
			run: (arg) => {
				const p = projects.find((x) => x.id === arg || x.name.toLowerCase() === (arg || '').toLowerCase());
				if (!p) return line(`open: ${arg || ''}: unknown project`, 'err');
				go('20_projects', p.id);
				line(`→ ${p.name}`, 'ok');
				close();
			},
		},

		tree: {
			desc: 'print the whole map',
			run: () => {
				line('/home/arc');
				const vis = tree.filter((n) => !n.hidden || state.hidden);
				vis.forEach((n, i) => {
					const last = i === vis.length - 1;
					line(`${last ? '└──' : '├──'} ${n.id}/`);
					listing(n.id).forEach((c, j, a) => {
						line(`${last ? '   ' : '│  '} ${j === a.length - 1 ? '└──' : '├──'} ${c}`);
					});
				});
			},
		},

		grep: {
			desc: 'search skills and projects',
			run: (arg) => {
				if (!arg) return line('grep: give me something to look for', 'err');
				const q = arg.toLowerCase();
				let n = 0;
				for (const s of allSkills) {
					const name = nameOf(s.name);
					if ((name + ' ' + s.note.en).toLowerCase().includes(q)) {
						line(`10_stack/${s.id}: ${name} (level ${s.level}/5)`, 'ok'); n++;
					}
				}
				for (const p of projects) {
					if ((p.name + ' ' + p.summary.en + ' ' + p.stack.join(' ')).toLowerCase().includes(q)) {
						line(`20_projects/${p.id}: ${p.name} — ${p.stack.join(', ')}`, 'ok'); n++;
					}
				}
				if (!n) line(`grep: no match for "${arg}"`, 'dim');
			},
		},

		whoami: {
			desc: 'you',
			run: () => {
				line('guest');
				line(`  agent   ${navigator.userAgent.slice(0, 60)}`);
				line(`  lang    ${navigator.language}`);
				line(`  here    ${Math.round((Date.now() - START) / 1000)}s`);
				line('');
				line('  fixable with: hire', 'dim');
			},
		},

		neofetch: {
			desc: 'the classic',
			run: () => {
				const art = toText(growBonsai({ seed: seedOfToday(), w: 34, h: 20, tags: [] }))
					.split('\n');
				const info = [
					`${profile.handle}@web`,
					'─'.repeat(24),
					`role      ${profile.title.en}`,
					`located   ${profile.location.en}`,
					`school    ${profile.university.en}`,
					`langs     C++, Python`,
					`projects  ${projects.length}`,
					`skills    ${allSkills.length}`,
					`theme     ${state.theme}`,
					`uptime    ${Math.round((Date.now() - START) / 1000)}s`,
					`shell     arc-fm.web`,
				];
				const rows = Math.max(art.length, info.length);
				for (let i = 0; i < rows; i++) {
					line((art[i] ?? '').padEnd(36) + (info[i] ?? ''));
				}
			},
		},

		hire: {
			desc: 'how to reach me',
			run: () => {
				contacts.forEach((c) => line(`${c.label.padEnd(10)} ${c.value}`, 'ok'));
				line('');
				line('  freelance now, full-time later. i answer within a day.', 'dim');
			},
		},

		theme: {
			desc: 'mocha | latte',
			run: (arg) => {
				const next = arg || (state.theme === 'mocha' ? 'latte' : 'mocha');
				if (!['mocha', 'latte'].includes(next)) return line(`theme: ${next}?`, 'err');
				set({ theme: next });
				line(`theme → ${next}`, 'ok');
			},
		},

		lang: {
			desc: 'en | ru',
			run: (arg) => {
				const next = arg || (state.lang === 'en' ? 'ru' : 'en');
				if (!['en', 'ru'].includes(next)) return line(`lang: ${next}?`, 'err');
				set({ lang: next });
				line(`lang → ${next}`, 'ok');
			},
		},

		crt: {
			desc: 'scanlines, on or off',
			run: () => { set({ crt: !state.crt }); line(`crt → ${state.crt ? 'on' : 'off'}`, 'ok'); },
		},

		grow: {
			desc: 'grow a new bonsai',
			run: () => { bonsai.regrow(); line('a new tree. same seed algorithm, different seed.', 'ok'); },
		},

		clear: { desc: 'clear the log', run: () => clear(log) },

		date: {
			desc: 'now',
			run: () => line(new Date().toString()),
		},

		exit: {
			desc: 'leave the shell',
			run: () => { line('there is no exit. only :q', 'dim'); setTimeout(close, 500); },
		},

		// ── пасхалки ─────────────────────────────────────────────────────
		sudo: {
			desc: 'no',
			hidden: true,
			run: () => {
				line('arcash3nka is not in the sudoers file.', 'err');
				line('this incident has been reported.', 'err');
			},
		},
		rm: {
			desc: 'no',
			hidden: true,
			run: (arg) => {
				if ((arg || '').includes('/')) {
					line('rm: / is mounted read-only.', 'err');
					line('nice try though. that is exactly what i would have typed.', 'dim');
				} else line(`rm: ${arg || '?'}: permission denied`, 'err');
			},
		},
		vim: {
			desc: 'no',
			hidden: true,
			run: () => {
				line('vim: to exit, press :q');
				line('vim: to actually exit, close the tab. we both know it.', 'dim');
			},
		},
		make: {
			desc: 'no',
			hidden: true,
			run: (arg) => {
				if (!arg) return line("make: *** no targets specified. stop.", 'err');
				line(`make: nothing to be done for '${arg}'.`);
			},
		},
	};

	function listing(dir) {
		if (dir === '10_stack') return stack.flatMap((g) => g.items.map((i) => nameOf(i.name).toLowerCase()));
		if (dir === '20_projects') return projects.map((p) => p.id);
		if (dir === '90_contacts') return contacts.map((c) => c.id);
		if (dir === '30_education') return ['leti', 'algorithmika', 'self'];
		return [];
	}

	const nameOf = (n) => (typeof n === 'string' ? n : n.en);

	// ── ввод ─────────────────────────────────────────────────────────────
	function exec(raw) {
		const text = raw.trim();
		line(`${prompt.textContent} ${text}`, 'echo');
		if (!text) return;
		history.push(text); hi = history.length;

		const [name, ...rest] = text.split(/\s+/);
		const arg = rest.join(' ').replace(/^-+\w+\s*/, '');   // флаги игнорируем
		const cmd = commands[name];
		if (!cmd) {
			line(`${name}: command not found`, 'err');
			const near = Object.keys(commands).find((c) => c.startsWith(name[0]));
			if (near) line(`did you mean: ${near}?`, 'dim');
			return;
		}
		cmd.run(arg);
		updatePrompt();
	}

	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') { exec(input.value); input.value = ''; e.preventDefault(); }
		else if (e.key === 'ArrowUp') { hi = Math.max(0, hi - 1); input.value = history[hi] ?? ''; e.preventDefault(); }
		else if (e.key === 'ArrowDown') { hi = Math.min(history.length, hi + 1); input.value = history[hi] ?? ''; e.preventDefault(); }
		else if (e.key === 'Tab') {
			e.preventDefault();
			const v = input.value;
			const parts = v.split(/\s+/);
			const pool = parts.length > 1
				? [...tree.map((n) => n.id), ...projects.map((p) => p.id)]
				: Object.keys(commands);
			const stem = parts[parts.length - 1];
			const hit = pool.find((c) => c.startsWith(stem));
			if (hit) { parts[parts.length - 1] = hit; input.value = parts.join(' '); }
		} else if (e.key === 'Escape') { close(); }
		e.stopPropagation();
	});

	function open() {
		updatePrompt();
		if (!log.childElementCount) {
			line('arc-fm.web shell — type help', 'ok');
		}
		requestAnimationFrame(() => input.focus());
	}
	function close() { onClose?.(); }

	return { el, open, focus: () => input.focus() };
}
