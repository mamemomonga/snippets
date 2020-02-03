# スニペット集

コピペに便利なスニペット集です

# ページ一覧

## Linuxセットアップ

* [Debian, Ubuntu ベーシックセットアップ](./basic-setup-debian-ubuntu.md)
* [Debian, Ubuntu](./setup-debian-ubuntu.md)

## BashとCLIツール

* [Bash](./cli/bash.md)
* [jq](./cli/jq.md)
* [curl](./cli/curl.md)
* [ネットワーク関連](./cli/net.md)
* [いろいろなスクリプト](./cli/scripts.md)


## UNIX系アプリケーション(Linux, macOS)

* [Docker](./docker/index.md)
* [OpenSSL](./unix/openssl.md)
* [OpenSSH](./unix/openssh.md)
* [vim](./unix/vim.md)
* [tmux](./unix/tmux.md)
* [nginx](./unix/nginx.md)
* [MariaDB](./unix/mariadb.md)
* [PHP](./unix/php.md)
* [MySQL/MariaDB](./unix/mysql.md)

## EcmaScript6

* [EcmaScrpit6 Webアプリケーション](./es6_simple-web-app.md)

## Webサービス

* [Let's Encrypt](./services/letsencrypt.md)
* [Mastodon: ポスト](./services/mastodon_posts.md)


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

# ソースコード

これらは Markdownを少しだけ拡張したものを変換して作成しています、
[ソースはこちら](https://github.com/mamemomonga/snippets)です。

