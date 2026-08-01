#!/usr/bin/env python3
# ══════════════════════════════════════════════════════════════════════════
#  Импорт цветного ASCII-портрета в data/portrait.js
#
#  На вход — файл, который отдал конвертер картинки в ASCII: последователь-
#  ность <span style="color: rgb(r, g, b)">символы</span>. Понимает и rgb(),
#  и #rrggbb, и разбиение строк через <br>, и вариант вообще без разбиений.
#
#  Запуск:
#      python3 tools/portrait-import.py путь/к/файлу.html [--width 108]
#
#  Ширину обычно определять не нужно: конвертеры не сохраняют перенос
#  строк, поэтому она вычисляется из общего числа символов. Символьная
#  ячейка примерно вдвое выше, чем шире, а исходник квадратный — значит
#  колонок должно быть около удвоенного числа строк. Из всех разложений
#  берётся то, где это соотношение ближе всего к двум.
#
#  На выходе — data/portrait.js: палитра плюс RLE-поток ячеек. Кодирование
#  сжимает фон (сотни одинаковых '%' подряд) в единицы записей, поэтому
#  файл получается в разы меньше исходника.
# ══════════════════════════════════════════════════════════════════════════

import argparse
import html
import os
import re
import sys
from collections import Counter

SPAN = re.compile(
    r'<span[^>]*style\s*=\s*"[^"]*color:\s*'
    r'(?:rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)[^)]*\)|(#[0-9a-fA-F]{3,8}))'
    r'[^"]*"[^>]*>(.*?)</span>',
    re.S,
)


def parse_cells(text):
    """→ [(char, '#rrggbb'), ...] и, если были <br>, длины строк."""
    rows = re.split(r'<br\s*/?>', text, flags=re.I) if re.search(r'<br', text, re.I) else [text]

    cells, widths = [], []
    for row in rows:
        start = len(cells)
        for m in SPAN.finditer(row):
            if m.group(4):
                color = m.group(4).lower()
                if len(color) == 4:                       # #abc → #aabbcc
                    color = '#' + ''.join(c * 2 for c in color[1:])
                color = color[:7]
            else:
                color = '#%02x%02x%02x' % tuple(int(m.group(i)) for i in (1, 2, 3))
            # Пустой спан — это потерянный пробел: конвертеры вырезают
            # пробел в конце строки, а разметку под него оставляют. Если
            # его не вернуть, вся сетка сдвинется на символ и картинку
            # срежет по диагонали.
            text = html.unescape(m.group(5)).replace('\n', '').replace('\r', '')
            for ch in (text or ' '):
                cells.append((ch, color))
        if len(cells) > start:
            widths.append(len(cells) - start)

    return cells, widths


def guess_width(cells, widths):
    """
    Ширину определяем по самой картинке, а не по числу символов.

    Раскладка на строки верна тогда, когда соседние строки похожи: в любом
    изображении вертикальный градиент плавный. Если ширина ошиблась хотя бы
    на единицу, каждая следующая строка съезжает вбок, и расхождение резко
    растёт — картинку «срезает» по диагонали.

    Подход по соотношению сторон (колонок вдвое больше, чем строк) даёт
    правдоподобный, но неверный ответ: он не видит содержимого и одинаково
    рад и 105, и 107. Разница между ними — полтора раза по расхождению.
    """
    # если <br> дали одинаковые строки — верить им, там гадать нечего
    if len(widths) > 4 and len(set(widths)) == 1 and widths[0] > 8:
        return widths[0]

    n = len(cells)
    rgb = [tuple(int(c[i:i + 2], 16) for i in (1, 3, 5)) for _, c in cells]

    def mismatch(w):
        rows = n // w
        if rows < 8:
            return None
        total = count = 0
        for y in range(rows - 1):
            a, b = y * w, (y + 1) * w
            for x in range(0, w, 2):                      # каждый второй столбец
                p, q = rgb[a + x], rgb[b + x]
                total += abs(p[0] - q[0]) + abs(p[1] - q[1]) + abs(p[2] - q[2])
                count += 1
        return total / count

    scored = [(m, w) for w in range(40, 401) if (m := mismatch(w)) is not None]
    if not scored:
        return round((2 * n) ** 0.5)

    scored.sort()
    best = scored[0][1]
    if scored[0][0] * 1.15 > scored[1][0]:
        print('  ! ширина определилась неуверенно, проверь картинку глазами;'
              ' если «поехала» — задай --width вручную', file=sys.stderr)
    return best


def is_vivid(hexcolor):
    """Насыщенная ячейка = огонь; серая = фон или манекен."""
    r, g, b = (int(hexcolor[i:i + 2], 16) for i in (1, 3, 5))
    mx, mn = max(r, g, b), min(r, g, b)
    if mx == 0:
        return False
    return (mx - mn) / mx > 0.22 and mx > 60


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('source')
    ap.add_argument('--width', type=int, default=0)
    ap.add_argument('--out', default='data/portrait.js')
    args = ap.parse_args()

    raw = open(args.source, encoding='utf-8').read()
    cells, widths = parse_cells(raw)
    if not cells:
        sys.exit('не нашёл ни одного <span style="color: ..."> — это точно тот файл?')

    n = len(cells)
    w = args.width or guess_width(cells, widths)
    h = -(-n // w)

    palette = [c for c, _ in Counter(c for _, c in cells).most_common()]
    index = {c: i for i, c in enumerate(palette)}

    # фон — самый частый цвет; конвертер красит им белое поле оригинала
    bg = index[palette[0]]

    runs, cur = [], None
    for ch, color in cells:
        ci = index[color]
        if cur and cur[1] == ch and cur[2] == ci:
            cur[0] += 1
        else:
            cur = [1, ch, ci]
            runs.append(cur)

    vivid = [i for i, c in enumerate(palette) if is_vivid(c)]

    body = ',\n\t\t'.join(
        ','.join(f'[{c},{esc(ch)},{ci}]' for c, ch, ci in runs[i:i + 12])
        for i in range(0, len(runs), 12)
    )

    out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), args.out)
    with open(out, 'w', encoding='utf-8') as f:
        f.write(f'''// ══════════════════════════════════════════════════════════════════════════
//  ПОРТРЕТ — цветной ASCII, снятый с оригинальной картинки
//
//  Файл собран автоматически:
//      python3 tools/portrait-import.py <исходник>
//
//  Руками не правится. Чтобы обновить портрет, прогони конвертер заново.
//
//  Формат: палитра плюс RLE-поток [сколько, символ, индекс цвета] в
//  построчном порядке. Фон (bg) вынесен отдельно — рендер умеет его
//  прятать, чтобы портрет не выглядел светлым прямоугольником на тёмной
//  странице. vivid — индексы насыщенных цветов, то есть огня: только они
//  участвуют в мерцании.
// ══════════════════════════════════════════════════════════════════════════

export const portrait = {{
\tw: {w},
\th: {h},
\tbg: {bg},
\tvivid: {vivid},
\tpalette: {palette!r},
\truns: [
\t\t{body}
\t],
}};
'''.replace("'", '"'))

    print(f'  {n} символов → {w}×{h}')
    print(f'  палитра: {len(palette)} цветов, из них насыщенных: {len(vivid)}')
    print(f'  сжатие:  {len(runs)} записей вместо {n} ({100 * len(runs) // n}%)')
    print(f'  записал: {args.out}')


def esc(ch):
    return '"\\\\"' if ch == '\\' else ('"\\""' if ch == '"' else f'"{ch}"')


if __name__ == '__main__':
    main()
