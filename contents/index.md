# コピペが便利なスニペット集

コピペが便利なスニペット集です

# ページ一覧

* [Linux: Debian Jessie(8.x), Ubuntu xenial(14.04) の設定](linux_setup-debian-ubuntu.html)

# 使い方

#### [コピー] ボタンを押すと、テキストがクリップボードにコピーされます

例

	# {}
	Example

#### [コピー (command)] は、シェルのヒアドキュメントとしてラップされます

例1

	# {"wrap":"bash -xeu"}
	echo "こんにちは！"

例2

	# {"wrap":"cat > Hello.txt"}
	こんにちは！

#### PLACEHOLDER:[テキストエリア] は PLACEHOLDERを置換します

	# {"placeholder":"THE_UFO"}
	あなたは衝撃のTHE_UFOを見たことがありますか？

# ソースコード

これらは Markdownを少しだけ拡張したものを変換して作成しています、
[ソースはこちら](https://github.com/mamemomonga/linux-setup-snippets)です。
