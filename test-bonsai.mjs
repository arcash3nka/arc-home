// ══════════════════════════════════════════════════════════════════════════
//  Печатает три дерева в терминал — чтобы смотреть на бонсай, не открывая
//  браузер. Node в системе нет, поэтому запускается движком JavaScriptCore,
//  который лежит в macOS из коробки:
//
//    /System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc -m test-bonsai.mjs
// ══════════════════════════════════════════════════════════════════════════

import { growBonsai, toText } from './src/ascii/bonsai.js';

const say = typeof print === 'function' ? print : console.log;

for (const seed of [20260801, 20260802, 20260803]) {
	say(`── seed ${seed} ${'─'.repeat(40)}`);
	say(toText(growBonsai({ seed, w: 64, h: 34, tags: ['a', 'b', 'c'] })));
	say('');
}
