// ══════════════════════════════════════════════════════════════════════════
//  I18N — строки хранятся как { en, ru }, здесь только выбор
// ══════════════════════════════════════════════════════════════════════════

import { state } from './state.js';

export function t(value) {
	if (value == null) return '';
	if (typeof value === 'string') return value;
	return value[state.lang] ?? value.en ?? '';
}

export const LANGS = ['en', 'ru'];
export const nextLang = () => LANGS[(LANGS.indexOf(state.lang) + 1) % LANGS.length];
