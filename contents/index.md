# コピペが便利なスニペット集

コピペが便利なスニペット集です

# ページ一覧

## Linux, macOS, UNIX系OS

* [Debian Jessie(8.x), Ubuntu xenial(14.04)](linux_setup-debian-ubuntu.html)
* [nginx](linux_nginx.html)
* [MariaDB](linux_mariadb.html)
* [Docker](linux_docker.html)

## CLIアプリケーション

* [Bash](cli_bash.html)
* [Jq](cli_jq.html)

## マストドン

* [Mastodon: ポスト](mastodon_posts.html)

# 使い方

#### [コピー] ボタンを押すと、テキストがクリップボードにコピーされます

例

	#-- {}
	Example

#### [コピー (command)] は、シェルスクリプトのヒアドキュメントとしてラップされます

例1

	#-- {"wrap":"bash -xeu"}
	echo "こんにちは！"

例2

	#-- {"wrap":"cat > Hello.txt"}
	こんにちは！

#### PLACEHOLDER:[テキストエリア] は PLACEHOLDERを置換します

	#-- {"placeholder":"THE_UFO"}
	あなたは衝撃のTHE_UFOを見たことがありますか？

# ソースコード

これらは Markdownを少しだけ拡張したものを変換して作成しています、
[ソースはこちら](https://github.com/mamemomonga/snippets)です。
