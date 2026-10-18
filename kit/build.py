"""Build the two lecture decks (TriFuse / SVG+photo) from one template and the full script."""
import html, re, sys
from pathlib import Path

HERE = Path(__file__).parent
OUT = Path(sys.argv[1])

script = (HERE / "script.md").read_text()
sections = [s.strip() for s in re.split(r"\n---\n", script) if s.strip()]
assert len(sections) == 14, len(sections)


def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return t


def md(block):
    """Tiny markdown → HTML for speaker notes (paragraphs, bold, lists, stage directions)."""
    out, para, lst = [], [], None

    def flush():
        nonlocal para, lst
        if para:
            out.append("<p>" + "<br>".join(inline(x) for x in para) + "</p>")
            para = []
        if lst:
            tag, items = lst
            out.append(f"<{tag}>" + "".join(f"<li>{x}</li>" for x in items) + f"</{tag}>")
            lst = None

    for raw in block.split("\n"):
        line = raw.rstrip()
        s = line.strip()
        if not s:
            flush(); continue
        if s.startswith("### "):
            flush(); out.append("<h5 style='font-size:15px;margin:2px 0 6px'>" + inline(s[4:]) + "</h5>"); continue
        m = re.fullmatch(r"\*(\(.+\))\*", s)
        if m:
            flush(); out.append("<span class='dir'>" + html.escape(m.group(1)) + "</span>"); continue
        m = re.match(r"^(-|\d+\.)\s+(.*)", s)
        if m and not line.startswith("   "):
            if para:
                flush()
            tag = "ul" if m.group(1) == "-" else "ol"
            if not lst or lst[0] != tag:
                flush(); lst = (tag, [])
            lst[1].append(inline(m.group(2))); continue
        if lst and line.startswith("   "):
            lst[1][-1] += "<br>" + inline(s); continue
        if lst:
            flush()
        para.append(s)
    flush()
    return "\n".join(out)


def split(sec, marker):
    i = sec.index(marker)
    return sec[:i], sec[i:]

title, intro, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, final, epi, summ = sections
ch3a, ch3b = split(ch3, "*(※ここでトーンを少し強め")
ch4a, ch4b = split(ch4, "いまの状況に引き直して")
ch8a, ch8b = split(ch8, "しかし、ここで皆さんに強くお伝えしたいことがあります")
head = lambda s: s.split("\n", 1)[0] + "\n"
cont = lambda h, s: h + "*(（続き）)*\n\n" + s

notes = {
    "title": title, "intro": intro, "ch1": ch1, "ch2": ch2,
    "ch3a": ch3a, "ch3b": cont(head(ch3), ch3b),
    "ch4a": ch4a, "ch4b": cont(head(ch4), ch4b),
    "ch5": ch5, "ch6": ch6, "ch7": ch7,
    "ch8a": ch8a, "ch8b": cont(head(ch8), ch8b),
    "ch9": ch9, "final": final, "epi": epi, "sum": summ,
}

# every line of the script must appear in some slide's notes
joined = "\n".join(notes.values())
for line in script.split("\n"):
    s = line.strip()
    if s and s != "---":
        assert s in joined, s

notes_html = "\n".join(
    f'<div class="notes-src" id="notes-{k}">{md(v)}</div>' for k, v in notes.items()
)
tpl = (HERE / "template.html").read_text()
ids = re.findall(r'data-n="([^"]+)"', tpl)
assert ids == list(notes), (ids, list(notes))

for theme, name, title_txt in [
    ("theme-trifuse", "oil100_lecture_trifuse.html", "原油100ドル講義（TriFuse版）"),
    ("theme-photo", "oil100_lecture_svg_photo.html", "原油100ドル講義（SVG＋写真版）"),
]:
    page = tpl.replace("{{THEME}}", theme).replace("{{TITLE}}", title_txt).replace("{{NOTES}}", notes_html)
    (OUT / name).write_text(page)
    print("wrote", OUT / name, len(page.encode()) // 1024, "KB")
