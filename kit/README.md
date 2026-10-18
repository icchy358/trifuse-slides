# 動く資料（live slides）キット

台本から、1ファイルHTMLの「動く資料」を作るための部品一式。見本は原油100ドル講義（17枚）。

- `template.html` … スライド本体。`{{THEME}}` `{{TITLE}}` `{{NOTES}}` を build.py が差し込む
- `build.py` … `python3 build.py out` で TriFuse版とSVG＋写真版の2ファイルを書き出す。台本の全行が台本欄に入っているかを確かめる
- `script.md` … 台本（章を `---` で区切る）
- `shot.js` / `shot2.js` … PC画面の撮影、`shotm.js` … iPhone 13 画面の撮影、`ov.js <番号>` … スマホではみ出す要素の一覧、`pl.js` … 段階表示の撮影
  - 撮影対象のファイルは環境変数 `DECK` で変えられる（既定は `oil100_lecture_svg_photo.html`）

公開先: `https://icchy358.github.io/trifuse-slides/<フォルダ名>/`
