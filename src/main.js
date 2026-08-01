// ══════════════════════════════════════════════════════════════════════════
//  ГЛАВНЫЙ МОДУЛЬ — сборка интерфейса
//
//  Здесь только композиция: панели, курсор, оверлеи, размещение бонсая.
//  Контент живёт в data/, отрисовка разделов — в src/blocks/.
// ══════════════════════════════════════════════════════════════════════════

import { h, qs, clear } from './core/dom.js';
import { state, set, on } from './core/state.js';
import { t } from './core/i18n.js';
import { go, start as startRouter } from './core/router.js';
import { createShell } from './core/shell.js';
import { createBonsai } from './ascii/bonsaiView.js';
import { blocks } from './blocks/registry.js';
import { tree, childrenOf, nodeById, leafTags } from '../data/tree.js';
import { profile } from '../data/profile.js';
import { ui, bootLines } from '../data/ui.js';
import { allSkills } from '../data/stack.js';
import { projects } from '../data/projects.js';

// Сигнал страховочному скрипту в index.html: модули загрузились, экран
// загрузки подменять не нужно.
document.documentElement.dataset.booted = '1';

const els = {
	app: qs('#app'),
	nav: qs('#nav'),
	navTitle: qs('#nav-title'),
	filter: qs('#filter'),
	content: qs('#content'),
	rail: qs('#rail'),
	path: qs('#path'),
	hints: qs('#hints'),
	title: qs('#win-title'),
	btnLang: qs('#btn-lang'),
	btnTheme: qs('#btn-theme'),
	btnShell: qs('#btn-shell'),
	btnHelp: qs('#btn-help'),
	ovHelp: qs('#ov-help'),
	ovShell: qs('#ov-shell'),
	boot: qs('#boot'),
	bootLog: qs('#boot-log'),
};

const bonsai = createBonsai({ tags: leafTags });
const shell = createShell({ bonsai, onClose: () => overlay(null) });
els.ovShell.appendChild(shell.el);

let navItems = [];

// ══ навигация ═════════════════════════════════════════════════════════════

function buildItems() {
	const q = state.filter.trim().toLowerCase();
	// «домой» первой строкой: возврат на главную не должен требовать
	// догадки, что надо повторно кликнуть по текущему каталогу
	const items = [{ kind: 'home', id: '~' }];
	for (const node of tree) {
		if (node.hidden && !state.hidden) continue;
		if (q && !(node.id + ' ' + t(node.desc)).toLowerCase().includes(q)) continue;
		items.push({ kind: 'dir', id: node.id, node });
		if (state.dir === node.id) {
			for (const c of childrenOf(node.id)) {
				items.push({ kind: 'child', id: c.id, parent: node.id, child: c });
			}
		}
	}
	return items;
}

function renderNav() {
	navItems = buildItems();
	if (state.cursor >= navItems.length) state.cursor = Math.max(0, navItems.length - 1);

	clear(els.nav);
	navItems.forEach((it, i) => {
		const active = it.kind === 'home' ? state.dir == null
			: it.kind === 'dir' ? state.dir === it.id
				: state.dir === it.parent && state.focus === it.id;

		const glyph = it.kind === 'home' ? '⌂' : it.kind === 'dir' ? it.node.glyph : '└';
		const name = it.kind === 'home' ? '~' : it.kind === 'dir' ? it.id : t(it.child.name);
		const meta = it.kind === 'home' ? t(ui.home) : it.kind === 'dir' ? t(ui.dir) : '';

		const li = h('li', {
			class: 'nav-i'
				+ (it.kind === 'child' ? ' nav-c' : '')
				+ (it.kind === 'home' ? ' nav-h' : '')
				+ (active ? ' is-active' : ''),
			'data-accent': it.kind === 'dir' ? it.node.accent
				: it.kind === 'home' ? 'lavender' : null,
			'data-tag': it.kind === 'child' ? it.child.tag : null,
			'data-i': i,
			role: 'option',
			title: it.kind === 'home' ? t(ui.homeHint) : null,
			'aria-selected': String(i === state.cursor),
			tabindex: '-1',
			onClick: () => { state.cursor = i; activate(it); },
		},
			h('span', { class: 'nav-g', text: glyph }),
			h('span', { class: 'nav-n', text: name }),
			h('span', { class: 'nav-m', text: meta }),
		);
		els.nav.appendChild(li);
	});

	syncCursor();
}

function syncCursor() {
	[...els.nav.children].forEach((li, i) => {
		li.classList.toggle('is-cursor', i === state.cursor);
		li.setAttribute('aria-selected', String(i === state.cursor));
	});
	const cur = els.nav.children[state.cursor];
	cur?.scrollIntoView({ block: 'nearest' });

	// подсветка грозди при движении курсора — дерево реагирует на клавиатуру
	const tag = cur?.dataset.tag;
	bonsai.light(tag || null);
}

function activate(it) {
	if (!it) return;
	if (it.kind === 'home') go(null);
	else if (it.kind === 'dir') go(state.dir === it.id ? null : it.id);
	else go(it.parent, it.id);
}

// ══ контент ═══════════════════════════════════════════════════════════════

function renderContent() {
	clear(els.content);
	const node = state.dir ? nodeById(state.dir) : null;

	if (!node) {
		els.content.appendChild(hero());
		bonsai.mount(qs('#hero-bonsai'));
		els.app.dataset.view = 'root';
	} else {
		const make = blocks[node.block];
		els.content.appendChild(make ? make() : h('p', { text: '404' }));
		bonsai.mount(els.rail);
		els.app.dataset.view = 'dir';
		// раздел может отказаться от рельса с деревом (см. data/tree.js)
		els.app.dataset.rail = node.rail === false ? 'off' : 'on';
	}

	els.content.scrollTop = 0;
	wireTags();
	focusCard();
	renderPath();
}

function hero() {
	return h('div', { class: 'hero' },
		h('div', { class: 'hero-text' },
			h('p', { class: 'hero-k', text: '/home/arc' }),
			h('h1', { class: 'hero-n', text: profile.handle }),
			h('p', { class: 'hero-s', text: t(profile.title) }),
			h('p', { class: 'hero-tag', text: t(profile.tagline) }),

			h('dl', { class: 'facts' },
				profile.facts.flatMap((f) => [
					h('dt', { text: t(f.key) }),
					h('dd', { text: t(f.val) }),
				]),
			),

			h('div', { class: 'hero-dirs' },
				tree.filter((n) => !n.hidden).map((n) => h('button', {
					class: 'hero-d', type: 'button', 'data-accent': n.accent,
					onClick: () => go(n.id),
				},
					h('span', { class: 'hero-d-g', text: n.glyph }),
					h('span', { class: 'hero-d-n', text: n.id }),
					h('span', { class: 'hero-d-s', text: t(n.desc) }),
				)),
			),

			h('p', { class: 'hero-hint' },
				h('span', { text: t(ui.root.enter) + ' ' }),
				h('kbd', { text: ':' }),
				h('span', { text: ' · ' }),
				h('kbd', { text: '?' }),
			),
		),
		h('div', { class: 'hero-b', id: 'hero-bonsai' }),
	);
}

/** Наведение на карточку зажигает её гроздь на бонсае. */
function wireTags() {
	for (const el of els.content.querySelectorAll('[data-tag]')) {
		el.addEventListener('mouseenter', () => bonsai.light(el.dataset.tag));
		el.addEventListener('mouseleave', () => bonsai.light(null));
		el.addEventListener('focusin', () => bonsai.light(el.dataset.tag));
	}
}

function focusCard() {
	if (!state.focus) return;
	const card = qs('#card-' + CSS.escape(state.focus), els.content);
	if (!card) return;
	card.classList.add('is-open', 'is-focused');
	card.setAttribute?.('aria-expanded', 'true');
	requestAnimationFrame(() => card.scrollIntoView({ block: 'center', behavior: 'smooth' }));
	setTimeout(() => card.classList.remove('is-focused'), 1600);
}

function renderPath() {
	const parts = ['/home/arc'];
	if (state.dir) parts.push(state.dir);
	if (state.focus) parts.push(state.focus);
	els.path.textContent = parts.join('/') + (state.dir ? '' : '/');
	els.title.textContent = state.dir ? `arc-fm — ${state.dir}` : t(ui.windowTitle);
	document.title = state.dir
		? `${profile.handle} · ${state.dir}`
		: `${profile.handle} · ${t(profile.title)}`;
}

function renderChrome() {
	els.navTitle.textContent = t(ui.nav);
	els.path.title = t(ui.homeHint);
	els.filter.placeholder = '/';
	els.btnLang.textContent = state.lang.toUpperCase();
	els.btnTheme.textContent = state.theme === 'mocha' ? '◐' : '◑';

	clear(els.hints);
	for (const hint of ui.hints) {
		els.hints.appendChild(h('span', { class: 'hint' },
			h('kbd', { text: hint.key }),
			h('span', { text: t(hint.label) }),
		));
	}
}

function renderHelp() {
	const box = qs('.ov-box', els.ovHelp);
	clear(box);
	box.appendChild(h('h2', { class: 'ov-t', text: t(ui.help.title) }));
	box.appendChild(h('table', { class: 'keys' },
		h('tbody', null, ui.help.rows.map(([k, label]) => h('tr', null,
			h('td', null, h('kbd', { text: k })),
			h('td', { text: t(label) }),
		))),
	));
	box.appendChild(h('p', { class: 'note', text: t(ui.help.footer) }));
}

// ══ оверлеи ═══════════════════════════════════════════════════════════════

function overlay(which) {
	set({ overlay: which });
	els.ovHelp.hidden = which !== 'help';
	els.ovShell.hidden = which !== 'shell';
	if (which === 'help') renderHelp();
	if (which === 'shell') shell.open();
	if (!which) els.app.focus?.();
}

// ══ клавиатура ════════════════════════════════════════════════════════════

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konami = [];

function onKey(e) {
	if (e.metaKey) return;

	// пасхалка живёт поверх всего остального
	konami = [...konami, e.key].slice(-KONAMI.length);
	if (konami.join() === KONAMI.join()) {
		set({ crt: !state.crt });
		bonsai.regrow();
		konami = [];
		return;
	}

	if (state.overlay === 'shell') {
		if (e.key === 'Escape') { overlay(null); e.preventDefault(); }
		return;
	}
	if (state.overlay === 'help') {
		if (e.key === 'Escape' || e.key === '?') { overlay(null); e.preventDefault(); }
		return;
	}
	if (e.target === els.filter) {
		if (e.key === 'Escape') { els.filter.blur(); set({ filter: '' }); els.filter.value = ''; renderNav(); }
		if (e.key === 'Enter') { els.filter.blur(); activate(navItems[state.cursor]); }
		return;
	}
	// Буква берётся из e.code, а не из e.key: иначе в русской раскладке
	// vim-навигация отваливается, а этот сайт для человека из Петербурга.
	const letter = /^Key([A-Z])$/.exec(e.code)?.[1].toLowerCase() ?? '';

	if (e.ctrlKey) {
		if (letter === 'h') { set({ hidden: !state.hidden }); renderNav(); e.preventDefault(); }
		else if (letter === 'l') { set({ lang: state.lang === 'en' ? 'ru' : 'en' }); e.preventDefault(); }
		else if (letter === 't') { set({ theme: state.theme === 'mocha' ? 'latte' : 'mocha' }); e.preventDefault(); }
		return;
	}

	const is = (ch) => e.key === ch;
	const shifted = (code) => e.code === code && e.shiftKey;

	if (is('ArrowDown') || letter === 'j') {
		state.cursor = Math.min(navItems.length - 1, state.cursor + 1); syncCursor(); e.preventDefault();
	} else if (is('ArrowUp') || letter === 'k') {
		state.cursor = Math.max(0, state.cursor - 1); syncCursor(); e.preventDefault();
	} else if (letter === 'g') {
		state.cursor = e.shiftKey ? navItems.length - 1 : 0; syncCursor(); e.preventDefault();
	} else if (is('Enter') || is('ArrowRight') || letter === 'l') {
		activate(navItems[state.cursor]); e.preventDefault();
	} else if (is('Backspace') || is('ArrowLeft') || letter === 'h') {
		if (state.dir) { go(null); e.preventDefault(); }
	} else if (is(':') || shifted('Semicolon')) {
		overlay('shell'); e.preventDefault();
	} else if (is('?') || shifted('Slash')) {
		overlay('help'); e.preventDefault();
	} else if (is('/') || (e.code === 'Slash' && !e.shiftKey)) {
		els.filter.focus(); e.preventDefault();
	} else if (is('Escape') && state.filter) {
		set({ filter: '' }); els.filter.value = ''; renderNav();
	}
}

// ══ загрузка ══════════════════════════════════════════════════════════════

function boot() {
	const seen = (() => {
		try { return sessionStorage.getItem('arc.booted') === '1'; } catch { return false; }
	})();
	const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (seen || reduced) { finish(false); return; }

	const lines = bootLines({
		seed: bonsai.seed,
		skills: allSkills.length,
		projects: projects.length,
		lang: state.lang,
	});

	let i = 0;
	const timer = setInterval(() => {
		if (i >= lines.length) { clearInterval(timer); setTimeout(() => finish(true), 320); return; }
		const [kind, text] = lines[i++];
		els.bootLog.appendChild(h('div', { class: 'boot-l boot-' + kind, text }));
	}, 105);

	const skip = () => { clearInterval(timer); finish(true); };
	els.boot.addEventListener('click', skip, { once: true });
	window.addEventListener('keydown', skip, { once: true });

	function finish(animate) {
		els.boot.hidden = true;
		try { sessionStorage.setItem('arc.booted', '1'); } catch { /* ignore */ }
		set({ booted: true });
		els.app.classList.add('is-live');
		if (animate) bonsai.init(); else bonsai.init();
	}
}

// ══ старт ═════════════════════════════════════════════════════════════════

function applyPrefs() {
	const root = document.documentElement;
	root.dataset.theme = state.theme;
	root.dataset.crt = state.crt ? 'on' : 'off';
	root.lang = state.lang;
}

function init() {
	applyPrefs();
	renderChrome();

	els.filter.addEventListener('input', () => {
		set({ filter: els.filter.value });
		state.cursor = 0;
		renderNav();
	});

	// путь в нижней полосе — тоже дорога домой
	els.path.addEventListener('click', () => go(null));

	els.btnLang.addEventListener('click', () => set({ lang: state.lang === 'en' ? 'ru' : 'en' }));
	els.btnTheme.addEventListener('click', () => set({ theme: state.theme === 'mocha' ? 'latte' : 'mocha' }));
	els.btnShell.addEventListener('click', () => overlay('shell'));
	els.btnHelp.addEventListener('click', () => overlay('help'));
	for (const ov of [els.ovHelp, els.ovShell]) {
		ov.addEventListener('mousedown', (e) => { if (e.target === ov) overlay(null); });
	}

	window.addEventListener('keydown', onKey);

	on('route', () => { renderNav(); renderContent(); });
	on('change', (e) => {
		const keys = Object.keys(e.detail);
		if (keys.every((k) => k === 'dir' || k === 'focus' || k === 'overlay')) return;
		applyPrefs();
		renderChrome();
		renderNav();
		renderContent();
		if (state.overlay === 'help') renderHelp();
	});

	startRouter();
	boot();
}

init();
