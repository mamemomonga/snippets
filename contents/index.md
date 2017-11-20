# コピペが便利なスニペット集

コピペが便利なスニペット集です

# ページ一覧

## Linux, macOS, UNIX系OS

* [Debian Jessie(8.x), Ubuntu xenial(14.04)](./linux_setup-debian-ubuntu.md)
* [nginx](./linux_nginx.md)
* [MariaDB](./linux_mariadb.md)
* [Docker](./linux_docker.md)

## CLIアプリケーション

* [Bash](./cli_bash.md)
* [Jq](./cli_jq.md)
* [ネット関係](./cli_net.md)

## EcmaScript6

* [EcmaScrpit6 Webアプリケーション](./es6_simple-web-app.md)

## マストドン

* [Mastodon: ポスト](./mastodon_posts.md)


# このサイトについて

セットアップ作業やコード類を簡単にコピペすることができるスニペット集です。
ここにあるほとんどのコードはbashやcatへのヒアドキュメントとなっていて、
sh, bash, zshなどのUNIXシェル上にペーストすることで動作します。

ペーストするときは自分の求める挙動のものか、注意して実行してください。

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

# コピペの心得

* 初めてのコピペは危険な挙動がないか注意して実行
* Returnを押す前に一呼吸
* エラーがでても優しい気持ちで
* 転んでも泣かない

# ソースコード

これらは Markdownを少しだけ拡張したものを変換して作成しています、
[ソースはこちら](https://github.com/mamemomonga/snippets)です。

