"""Renderiza a saída real do mongosh em PNGs no estilo do painel Output do VS Code.

Uso: python3 prints.py <saida.txt> <dir_destino> <prefixo> <regex_titulo> <arquivo_origem>
Cada seção (linha que casa com regex_titulo) vira um ou mais PNGs (quebra em MAX linhas).
"""
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

MONO = "/usr/share/fonts/google-noto/NotoSansMono-Regular.ttf"
MONO_B = "/usr/share/fonts/google-noto/NotoSansMono-Bold.ttf"
SANS = "/usr/share/fonts/google-noto/NotoSans-Regular.ttf"
for p in (MONO, MONO_B, SANS):
    if not Path(p).exists():
        sys.exit(f"fonte ausente: {p}")

FS = 15
LH = 21
PAD = 16
MAX = 70
W = 980

BG = "#1e1e1e"
BAR = "#252526"
TAB_LINE = "#007acc"
FG = "#d4d4d4"
STR = "#ce9178"
NUM = "#b5cea8"
KEY = "#9cdcfe"
FUNC = "#dcdcaa"
TITLE = "#4ec9b0"
DIM = "#858585"

font = ImageFont.truetype(MONO, FS)
font_b = ImageFont.truetype(MONO_B, FS)
ui = ImageFont.truetype(SANS, 12)

TOKEN = re.compile(
    r"(?P<str>'(?:[^'\\]|\\.)*')"
    r"|(?P<func>\b(?:ISODate|ObjectId)\b)"
    r"|(?P<key>\b[A-Za-z_][\w]*(?=:))"
    r"|(?P<num>-?\b\d+(?:\.\d+)?\b)"
    r"|(?P<kw>\b(?:null|true|false)\b)"
)


def tokens(line):
    pos = 0
    for m in TOKEN.finditer(line):
        if m.start() > pos:
            yield line[pos : m.start()], FG
        kind = m.lastgroup
        color = {"str": STR, "func": FUNC, "key": KEY, "num": NUM, "kw": "#569cd6"}[kind]
        yield m.group(), color
        pos = m.end()
    if pos < len(line):
        yield line[pos:], FG


def render(lines, out, title_re, origem, parte, total):
    h = 34 + 26 + PAD * 2 + LH * len(lines)
    img = Image.new("RGB", (W, h), BG)
    d = ImageDraw.Draw(img)
    # barra de abas do painel
    d.rectangle([0, 0, W, 34], fill=BAR)
    x = 14
    for i, tab in enumerate(["PROBLEMS", "OUTPUT", "DEBUG CONSOLE", "TERMINAL"]):
        tw = d.textlength(tab, font=ui)
        d.text((x, 10), tab, font=ui, fill="#e7e7e7" if i == 1 else DIM)
        if i == 1:
            d.line([x, 32, x + tw, 32], fill=TAB_LINE, width=2)
        x += tw + 24
    sel = "Playground output"
    d.rounded_rectangle([W - 190, 7, W - 14, 27], radius=2, fill="#3c3c3c")
    d.text((W - 182, 10), sel + "  ˅", font=ui, fill="#cccccc")
    # linha de contexto
    ctx = f"> mongosh (MongoDB Atlas)  ·  {origem}"
    if total > 1:
        ctx += f"  ·  parte {parte}/{total}"
    d.text((PAD, 40), ctx, font=ui, fill=DIM)
    y = 34 + 26 + PAD - 6
    for ln in lines:
        x = PAD
        if re.match(title_re, ln):
            d.text((x, y), ln, font=font_b, fill=TITLE)
        else:
            for txt, color in tokens(ln):
                d.text((x, y), txt, font=font, fill=color)
                x += d.textlength(txt, font=font)
        y += LH
    img.save(out, optimize=True)


def dividir(sec):
    """Quebra em partes de tamanho parecido, cortando logo após o fim de um documento ('  },')."""
    import math

    n = math.ceil(len(sec) / MAX)
    if n <= 1:
        return [sec]
    alvo = len(sec) / n
    partes, ini = [], 0
    for _ in range(n - 1):
        corte = int(ini + alvo)
        cands = [i for i in range(ini + 1, min(ini + MAX, len(sec))) if sec[i] == "  },"]
        if cands:
            corte = min(cands, key=lambda i: abs(i - corte)) + 1
        partes.append(sec[ini:corte])
        ini = corte
    partes.append(sec[ini:])
    return partes


def main():
    saida, dest, prefixo, title_re, origem = sys.argv[1:6]
    dest = Path(dest)
    dest.mkdir(parents=True, exist_ok=True)
    lines = Path(saida).read_text(encoding="utf-8").rstrip("\n").split("\n")
    secoes, cur = [], None
    for ln in lines:
        if re.match(title_re, ln):
            cur = [ln]
            secoes.append(cur)
        elif cur is not None:
            cur.append(ln)
    for i, sec in enumerate(secoes, 1):
        while sec and not sec[-1].strip():
            sec.pop()
        partes = dividir(sec)
        for k, p in enumerate(partes, 1):
            nome = f"{prefixo}{i}" + (f"_{k}" if len(partes) > 1 else "") + ".png"
            render(p, dest / nome, title_re, origem, k, len(partes))
            print(dest / nome, len(p))


main()
