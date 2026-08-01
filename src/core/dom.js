// ══════════════════════════════════════════════════════════════════════════
//  DOM — микро-хелпер вместо фреймворка
//
//  Текст всегда вставляется как текст. Разметка — только через явный
//  ключ html, и только там, где содержимое своё. Никакого innerHTML
//  с внешними данными: с GitHub приходят чужие строки.
// ══════════════════════════════════════════════════════════════════════════

export function h(tag, props = null, ...children) {
	const el = document.createElement(tag);

	if (props) {
		for (const [k, v] of Object.entries(props)) {
			if (v == null || v === false) continue;
			if (k === 'class') el.className = v;
			else if (k === 'text') el.textContent = v;
			else if (k === 'html') el.innerHTML = v;
			else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
			else if (k === 'data') for (const [dk, dv] of Object.entries(v)) el.dataset[dk] = dv;
			else if (k.startsWith('on') && typeof v === 'function') {
				el.addEventListener(k.slice(2).toLowerCase(), v);
			} else el.setAttribute(k, v === true ? '' : v);
		}
	}

	add(el, children);
	return el;
}

function add(el, kids) {
	for (const c of kids) {
		if (c == null || c === false) continue;
		if (Array.isArray(c)) add(el, c);
		else if (c instanceof Node) el.appendChild(c);
		else el.appendChild(document.createTextNode(String(c)));
	}
}

export const frag = (...children) => {
	const f = document.createDocumentFragment();
	add(f, children);
	return f;
};

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

export function clear(el) {
	while (el.firstChild) el.removeChild(el.firstChild);
	return el;
}

/** Шкала уровня в духе прогресс-баров из моего хранилища. */
export function levelBar(level, max = 5) {
	return '█'.repeat(level) + '░'.repeat(Math.max(0, max - level));
}
